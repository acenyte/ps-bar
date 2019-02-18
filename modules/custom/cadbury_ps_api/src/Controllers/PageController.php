<?php

/**
 * @file
 * Contains \Drupal\cadbury_ps_api\Controller\PageController.
 */

namespace Drupal\cadbury_ps_api\Controllers;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

use Drupal\cadbury_ps_api\Models\Result;

class PageController extends ControllerBase {

    /**
     * @inheritDoc
     */
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
    }

    /**
     * Renders a page with the supplied result meta information
     *
     * @param int $id
     * @param string $token
     * @return string
     */
    public function loadResultImage($id, $token){
        $result = Result::load($id, $token);
        $meta = json_decode($result['data']['meta'], true);
        $image = str_replace('data:image/jpeg;base64,', '', $meta['result_image_facebook']);
        header('Content-Type: image/jpeg');
        echo base64_decode( $image );
        die;
    }
}
