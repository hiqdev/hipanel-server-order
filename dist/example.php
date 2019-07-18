<?php

final class ExampleSender
{
    /**
     * @var string
     */
    public $apiUrl = 'https://hiapi.advancedhosters.com';

    /**
     * @var resource
     */
    private $curl;

    public function __construct(string $path)
    {
        if ($curl = curl_init()) {
            curl_setopt($curl, CURLOPT_URL, $this->apiUrl . $path);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_POST, true);
            $this->curl = $curl;
        }
    }

    public function __destruct()
    {
        curl_close($this->curl);
    }

    public function setParams(string $query): self
    {
        curl_setopt($this->curl, CURLOPT_POSTFIELDS, $query);

        return $this;
    }

    public function getData(): array
    {
        return json_decode(curl_exec($this->curl));
    }
}

$configs = (new ExampleSender('/configsGetAvailable'))
    ->setParams('0=and&1%5Bseller%5D=dsr&2%5Bwith_prices%5D=1&select%5B%2A%5D=%2A&select%5Bprices%5D=prices&with_prices=1&seller=dsr')
    ->getData();

$configsByLocation = [];
foreach ($configs as $config) {
    $configsByLocation[$config->location][] = $config;
}

$osimages = (new ExampleSender('/osimagesSearch'))
    ->setParams('type=dedicated&type=dedicated&seller=dsr')
    ->getData();

$js = sprintf('<script type="text/javascript">var %s = %s;</script>', 'window.hipanel_server_order', json_encode([
    'initialStates' => [
        'action' => '/server/order/add-to-cart-dedicated',
        'location' => 'us',
        'language' => 'en',
    ],
    'pathToIcons' => '' . DIRECTORY_SEPARATOR,
    'configs' => $configsByLocation,
    'osImages' => $osimages,
], JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS));

$indexHtml = file_get_contents('index.html');

echo strtr($indexHtml, ['</head>' => $js . '</head>']);