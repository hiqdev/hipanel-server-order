<?php

namespace hipanel\server\order\yii;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class ServerOrderAdvancedhostingThemeAsset extends AssetBundle
{
    public $sourcePath = '@hipanel/server/order/yii/assets';

    public $css = [
        'css/advancedhosting.theme.css',
    ];

    public $depends = [
        BootstrapPluginAsset::class,
    ];
}
