<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class ServerOrderAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/dist';

    public $js = [
        'vendor.2bd43bdd.js',
        'app.f8419195.js',
    ];

    public $depends = [
        BootstrapPluginAsset::class,
    ];
}
