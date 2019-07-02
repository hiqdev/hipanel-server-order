<?php
/* @var $this View */

/* @var $content string */

use yii\helpers\Html;
use yii\web\View;
use \hipanel\server\order\yii\ServerOrderAdvancedhostingThemeAsset;
use hiqdev\thememanager\widgets\Flashes;

ServerOrderAdvancedhostingThemeAsset::register($this);

?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>
<?= $content ?>
<?= Flashes::widget() ?>
<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
