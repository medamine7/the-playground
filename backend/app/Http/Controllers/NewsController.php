<?php

namespace App\Http\Controllers;

use App\Services\News\NewsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(Request $request)
    {
        try {
            $page = $request->input('page');
            $pageSize = $request->input('page_size');

            $response = $this->newsService->getHeadlines($page, $pageSize);

            return response()->json($response, Response::HTTP_OK, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            Log::error('An error occurred: ' . $e->getMessage());

            return response()->json([
                'error' => 'An error occurred.',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function search(Request $request)
    {
        try {
            $query = $request->input('query');
            $page = $request->input('page');
            $pageSize = $request->input('page_size');

            $response = $this->newsService->search($query, $page, $pageSize);

            return response()->json($response, Response::HTTP_OK, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            Log::error('An error occurred: ' . $e->getMessage());

            return response()->json([
                'error' => 'An error occurred.',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getOne($provider, $id)
    {
        try {
            $response = $this->newsService->getOne($provider, $id);

            return response()->json($response, Response::HTTP_OK, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            Log::error('An error occurred: ' . $e->getMessage());

            return response()->json([
                'error' => 'An error occurred.',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
