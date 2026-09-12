<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_name' => $this->faker->company(),
            'project_name' => $this->faker->bs(),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['Planning', 'In Progress', 'On Hold', 'Completed']),
            'priority' => $this->faker->randomElement(['Low', 'Medium', 'High']),
            'start_date' => now()->format('Y-m-d'),
            'due_date' => now()->addDays(30)->format('Y-m-d'),
        ];
    }
}
