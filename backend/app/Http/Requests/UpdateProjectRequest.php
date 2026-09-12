<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends StoreProjectRequest
{
    // Inherits identical validation rules from StoreProjectRequest.
    // Kept as a separate class so update-specific rules (e.g. partial updates
    // with `sometimes`) can be added later without touching create logic.
}
