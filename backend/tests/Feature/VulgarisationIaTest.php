<?php

namespace Tests\Feature;

use App\Jobs\GenerateVulgarisationJob;
use App\Models\Recherche;
use App\Models\User;
use App\Services\LlmService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use RuntimeException;
use Tests\TestCase;

class VulgarisationIaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.llm.enabled' => true,
            'services.llm.url'     => 'http://lm-studio:1234/v1',
            'services.llm.model'   => 'test-model',
        ]);
    }

    private function recherche(User $user, array $attrs = []): Recherche
    {
        return Recherche::create($attrs + [
            'user_id'  => $user->id,
            'titre'    => 'Recherche test',
            'abstract' => 'Un abstract scientifique à vulgariser.',
        ]);
    }

    public function test_job_appelle_le_llm_et_sauvegarde_la_vulgarisation(): void
    {
        Http::fake([
            'lm-studio:1234/v1/chat/completions' => Http::response([
                'choices' => [['message' => ['content' => 'Texte vulgarisé.']]],
            ]),
        ]);

        $recherche = $this->recherche(User::factory()->create());
        Cache::put(GenerateVulgarisationJob::statusKey($recherche->id), ['state' => 'pending']);

        GenerateVulgarisationJob::dispatchSync($recherche, 'grand_public', 'fr');

        Http::assertSent(fn ($request) =>
            $request->url() === 'http://lm-studio:1234/v1/chat/completions'
            && $request['model'] === 'test-model'
            && str_contains($request['messages'][1]['content'], 'Un abstract scientifique')
        );

        $this->assertDatabaseHas('vulgarisations', [
            'recherche_id'  => $recherche->id,
            'resume'        => 'Texte vulgarisé.',
            'niveau_public' => 'grand_public',
            'langue'        => 'fr',
            'pdf_path'      => null,
        ]);
        $this->assertNull(Cache::get(GenerateVulgarisationJob::statusKey($recherche->id)));

        // Le résultat est exposé par l'API publique consommée par le front React.
        $this->getJson("/api/recherches/{$recherche->id}/vulgarisations")
             ->assertOk()
             ->assertJsonPath('0.resume', 'Texte vulgarisé.');
    }

    public function test_pdf_illisible_se_rabat_sur_l_abstract(): void
    {
        Http::fake(['*' => Http::response(['choices' => [['message' => ['content' => 'Depuis abstract.']]]])]);

        $recherche = $this->recherche(User::factory()->create(), ['pdf_path' => 'recherches/inexistant.pdf']);

        GenerateVulgarisationJob::dispatchSync($recherche, 'grand_public', 'fr');

        Http::assertSent(fn ($request) => str_contains($request['messages'][1]['content'], 'Un abstract scientifique'));
        $this->assertDatabaseHas('vulgarisations', ['recherche_id' => $recherche->id, 'resume' => 'Depuis abstract.']);
    }

    public function test_erreur_http_du_llm_est_remontee_explicitement(): void
    {
        Http::fake(['*' => Http::response('model not loaded', 404)]);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Erreur LLM HTTP 404');

        app(LlmService::class)->vulgariser('texte', 'grand_public', 'fr');
    }

    public function test_echec_du_job_est_visible_sur_la_fiche_recherche(): void
    {
        $user = User::factory()->create();
        $recherche = $this->recherche($user);

        (new GenerateVulgarisationJob($recherche, 'grand_public', 'fr'))
            ->failed(new RuntimeException('Service IA injoignable'));

        $this->actingAs($user)
             ->get(route('admin.recherches.show', $recherche))
             ->assertOk()
             ->assertSee('La génération IA a échoué')
             ->assertSee('Service IA injoignable');
    }

    public function test_lancement_met_le_job_en_file_et_affiche_l_etat_en_cours(): void
    {
        Queue::fake();
        $user = User::factory()->create();
        $recherche = $this->recherche($user);

        $this->actingAs($user)
             ->post(route('admin.vulgarisations.preview', $recherche), [
                 'niveau_public' => 'grand_public',
                 'langue'        => 'fr',
             ])
             ->assertRedirect(route('admin.recherches.show', $recherche));

        Queue::assertPushed(GenerateVulgarisationJob::class);

        $this->actingAs($user)
             ->get(route('admin.recherches.show', $recherche))
             ->assertSee('Génération IA en cours');
    }

    public function test_lancement_refuse_si_llm_desactive(): void
    {
        Queue::fake();
        config(['services.llm.enabled' => false]);
        $user = User::factory()->create();
        $recherche = $this->recherche($user);

        $this->actingAs($user)
             ->post(route('admin.vulgarisations.preview', $recherche), [
                 'niveau_public' => 'grand_public',
                 'langue'        => 'fr',
             ])
             ->assertSessionHas('error');

        Queue::assertNothingPushed();
    }
}
