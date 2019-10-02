<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapAsset;
use yii\web\AssetBundle;

class ServerOrderAdvancedhostingThemeAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $css = [
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap&subset=cyrillic',
    ];

    public $depends = [
        BootstrapAsset::class,
    ];
}
