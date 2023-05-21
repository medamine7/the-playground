<?php

namespace App\Services\News\Factory;

use App\Services\News\NewsServiceInterface;

use Illuminate\Support\Facades\Http;

class TheGuardianService implements NewsServiceInterface
{
    private $client;

    public function __construct()
    {
        $this->client = Http::theGuardian();
    }

    public function getHeadlines($page = 1, $pageSize = 50)
    {
        $response = $this->client
            ->withOptions([
                'query' => [
                    'show-fields' => 'thumbnail,bodyText,byline,trailText',
                    'page' => $page,
                    'page-size' => $pageSize,
                ],
            ])
            ->get('/search');

        return $response->json();
    }

    public function search($query, $page = 1, $pageSize = 50)
    {
        $response = $this->client
            ->withOptions([
                'query' => [
                    'q' => $query,
                    'page' => $page,
                    'page-size' => $pageSize,
                    'show-fields' => 'thumbnail,bodyText,byline,trailText',
                ],
            ])
            ->get('/search');

        return $response->json();
    }

    public function normalizeData($data) {
        if (empty($data)) {
            return [];
        }

        $articles = $data['response']['results'];
        $normalizedData = [];

        foreach ($articles as $article) {
            $normalizedData[] = [
                'provider' => 'TheGuardian',
                'id' => get_array_value_safely($article, 'id'),
                'title' => get_array_value_safely($article, 'webTitle'),
                'description' => get_array_value_safely($article, 'fields.trailText'),
                'url' => get_array_value_safely($article, 'webUrl'),
                'image' => get_array_value_safely($article, 'fields.thumbnail'),
                'date' => get_array_value_safely($article, 'webPublicationDate'),
                'content' => get_array_value_safely($article, 'fields.bodyText'),
                'source' => get_array_value_safely($article, 'sectionName'),
                'author' => get_array_value_safely($article, 'fields.byline'),
                'category' => get_array_value_safely($article, 'sectionName'),
            ];
        }

        return $normalizedData;
    }

    public function getOne($id) {
        $response = $this->client
            ->withOptions([
                'query' => [
                    'ids' => $id,
                    'show-fields' => 'thumbnail,bodyText,byline,trailText',
                ],
            ])
            ->get('/search');

        return $response->json();
    }
}
