<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Le site public est servi par le front React : Laravel n'expose pas « / ».
     * On vérifie la route de santé déclarée dans bootstrap/app.php.
     */
    public function test_health_endpoint_returns_a_successful_response(): void
    {
        $response = $this->get('/up');

        $response->assertStatus(200);
    }
}
