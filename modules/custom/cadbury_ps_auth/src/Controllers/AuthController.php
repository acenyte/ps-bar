<?php

/**
 * @file
 * Contains \Drupal\cadbury_ps_auth\Controller\ApiController.
 */

namespace Drupal\cadbury_ps_auth\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AuthController extends ControllerBase {

    /**
     * @inheritDoc
     */
    public function __construct($test, $hello, $world) {
        header('Access-Control-Allow-Origin: *');
    }

    /**
     * Handles the registration complete redirect
     *
     * @return void
     */
    public function registrationComplete(){
        header('Location: '.$_GET['i']);
        exit();
    }

}
