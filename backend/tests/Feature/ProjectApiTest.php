<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_all_projects(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertOk()->assertJsonCount(3);
    }

    public function test_can_create_a_project_with_valid_data(): void
    {
        $payload = [
            'client_name' => 'Acme Corp',
            'project_name' => 'Website Redesign',
            'description' => 'Full redesign',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-09-20',
            'due_date' => '2026-09-25',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertCreated()->assertJsonFragment(['client_name' => 'Acme Corp']);
        $this->assertDatabaseHas('projects', ['project_name' => 'Website Redesign']);
    }

    public function test_client_name_is_required(): void
    {
        $payload = [
            'project_name' => 'Website Redesign',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-01-01',
            'due_date' => '2026-02-01',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors('client_name');
    }

    public function test_due_date_cannot_be_earlier_than_start_date(): void
    {
        $payload = [
            'client_name' => 'Acme Corp',
            'project_name' => 'Website Redesign',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-02-01',
            'due_date' => '2026-01-01', // before start_date
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors('due_date');
    }

    public function test_status_must_be_a_valid_value(): void
    {
        $payload = [
            'client_name' => 'Acme Corp',
            'project_name' => 'Website Redesign',
            'status' => 'NotARealStatus',
            'priority' => 'High',
            'start_date' => '2026-01-01',
            'due_date' => '2026-02-01',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors('status');
    }

    public function test_can_update_a_project(): void
    {
        $project = Project::factory()->create(['client_name' => 'Old Name']);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'client_name' => 'New Name',
            'project_name' => $project->project_name,
            'status' => $project->status,
            'priority' => $project->priority,
            'start_date' => $project->start_date->format('Y-m-d'),
            'due_date' => $project->due_date->format('Y-m-d'),
        ]);

        $response->assertOk()->assertJsonFragment(['client_name' => 'New Name']);
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'client_name' => 'New Name']);
    }

    public function test_can_delete_a_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_returns_404_for_nonexistent_project(): void
    {
        $response = $this->getJson('/api/projects/999');

        $response->assertNotFound();
    }

    public function test_can_filter_projects_by_status(): void
    {
        Project::factory()->create(['status' => 'Completed']);
        Project::factory()->create(['status' => 'Planning']);

        $response = $this->getJson('/api/projects?status=Completed');

        $response->assertOk()->assertJsonCount(1);
    }

    public function test_can_search_projects_by_client_name(): void
    {
        Project::factory()->create(['client_name' => 'Microsoft Inc']);
        Project::factory()->create(['client_name' => 'Google LLC']);

        $response = $this->getJson('/api/projects?search=Microsoft');

        $response->assertOk()->assertJsonCount(1);
    }
}