<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class ServerOrderAdvancedhostingThemeAsset extends AssetBundle
{
    public $css = [
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap&subset=cyrillic',
    ];

    public $depends = [
        BootstrapPluginAsset::class,
    ];
}
