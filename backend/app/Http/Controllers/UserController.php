<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'password' => 'sometimes|required_with:password_confirmation|string|min:8|confirmed',
        ]);

        $data = [];

        if ($request->has('name')) {
            $data['name'] = $request->input('name');
        }

        if ($request->has('password')) {
            $data['password'] = Hash::make($request->input('password'));
        }

        if (count($data) === 0) {
            return response()->json(['message' => 'No updates provided'], 400);
        }

        $user->update($data);

        $updatedUser = User::find($user->id);

        return response()->json([
            'id' => $updatedUser->id,
            'name' => $updatedUser->name,
            'email' => $updatedUser->email,
        ]);
    }
}
