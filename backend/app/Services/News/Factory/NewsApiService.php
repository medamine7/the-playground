<?php

namespace App\Services\News\Factory;

use App\Services\News\NewsServiceInterface;

use Illuminate\Support\Facades\Http;

class NewsApiService implements NewsServiceInterface
{
    private $client;

    public function __construct()
    {
        $this->client = Http::newsApi();
    }

    public function getHeadlines($page = 1, $pageSize = 50)
    {
        $response = $this->client
            ->withOptions([
                'query' => [
                    'pageSize' => $pageSize,
                    'page' => $page,
                ],
            ])
            ->get('/top-headlines');
        return $response->json();
    }

    public function search($query, $page = 1, $pageSize = 50)
    {
        $response = $this->client->get('/everything?q=' . $query . '&pageSize=' . $pageSize . '&page=' . $page . '&language=en');
        return $response->json();
    }

    public function normalizeData($data) {
        if (empty($data)) {
            return [];
        }

        $articles = $data['articles'] ?? [];
        $normalizedData = [];

        foreach ($articles as $article) {
            $normalizedData[] = [
                'provider' => 'NewsAPI',
                'id' => get_array_value_safely($article, 'title'),
                'title' => get_array_value_safely($article, 'title'),
                'description' => get_array_value_safely($article, 'description'),
                'url' => get_array_value_safely($article, 'url'),
                'image' => get_array_value_safely($article, 'urlToImage'),
                'date' => get_array_value_safely($article, 'publishedAt'),
                'content' => get_array_value_safely($article, 'content'),
                'source' => get_array_value_safely($article, 'source.name'),
                'author' => get_array_value_safely($article, 'author'),
            ];
        }

        return $normalizedData;
    }

    public function getOne($id) {
        dd($id);
        $response = $this
            ->client
            ->withOptions([
                'query' => [
                    'q' => $id,
                ]
            ])
            ->get('/everything');
        return $response->json();
    }
}
