<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'phone' => ['required', 'regex:/^\+?[0-9]{7,15}$/'], // Custom rule for phone
            'adress' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'company.required' => 'Le nom de la société est obligatoire.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.regex' => 'Le numéro de téléphone doit être valide.', // Custom phone validation message
            'adress.required' => 'L’adresse est obligatoire.',
            'email.required' => 'L’email est obligatoire.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        // Create the user with additional fields
        $user = User::create([
            'name' => $request->name,
            'company' => $request->company,
            'phone' => $request->phone,
            'adress' => $request->adress,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Trigger the Registered event and log the user in
        event(new Registered($user));
        Auth::login($user);

        // Redirect to the home route
        return redirect(RouteServiceProvider::HOME);
    }
}
