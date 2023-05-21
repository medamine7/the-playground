<?php

namespace App\Services\News;

class NewsService {
    private const PROVIDERS = ['NewsApi', 'TheGuardian', 'NewYorkTimes'];

    private function getProvider($provider) {

        $result = array_filter(self::PROVIDERS, function($item) use ($provider) {
            return strtolower($item) === strtolower($provider);
        });

        if (!empty($result)) {
            $provider = reset($result);
        } else {
            throw new \Exception('Provider not found');
        }

        $providerClass = 'App\\Services\\News\\Factory\\' . $provider . 'Service';
        return new $providerClass;
    }

    public function getHeadlines($page = 1, $pageSize = 50) {
        $data = [];
        foreach (self::PROVIDERS as $provider) {
            $provider = $this->getProvider($provider);
            $providerData = $provider->getHeadlines($page, $pageSize);
            $data = array_merge($data, $provider->normalizeData($providerData));
        }

        $result = [
            'articles' => $data,
            ...$this->getMetadata($data),
        ];

        return $result;
    }

    public function search($query, $page = 1, $pageSize = 50) {
        $data = [];
        foreach (self::PROVIDERS as $provider) {
            $provider = $this->getProvider($provider);
            $providerData = $provider->search($query, $page, $pageSize);
            $data = array_merge($data, $provider->normalizeData($providerData));
        }

        $result = [
            'articles' => $data,
            ...$this->getMetadata($data),
        ];

        return $result;
    }

    public function getOne($provider, $id) {
        $provider = $this->getProvider($provider);
        $data = $provider->getOne($id);
        $result = $provider->normalizeData($data)[0] ?? null;
        return $result;
    }

    private function getMetadata($data) {
        $collection = collect($data);
        $sources = $collection->pluck('source')->unique()->whereNotNull()->values();
        $authors = $collection->pluck('author')->unique()->whereNotNull()->values();
        $categories = $collection->pluck('category')->unique()->whereNotNull()->values();

        return [
            'totalResults' => count($collection),
            'sources' => $sources,
            'authors' => $authors,
            'categories' => $categories,
        ];
    }
}
