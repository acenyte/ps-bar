<?php

namespace Drupal\openid_connect\Form;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\openid_connect\OpenIDConnectSession;
use Drupal\openid_connect\OpenIDConnectClaims;
use Drupal\openid_connect\Plugin\OpenIDConnectClientManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\BrowserKit\Request;

/**
 * Class OpenIDConnectLoginForm.
 *
 * @package Drupal\openid_connect\Form
 */
class OpenIDConnectLoginForm extends FormBase implements ContainerInjectionInterface
{

    /**
     * The OpenID Connect session service.
     *
     * @var \Drupal\openid_connect\OpenIDConnectSession
     */
    protected $session;

    /**
     * Drupal\openid_connect\Plugin\OpenIDConnectClientManager definition.
     *
     * @var \Drupal\openid_connect\Plugin\OpenIDConnectClientManager
     */
    protected $pluginManager;

    /**
     * The OpenID Connect claims.
     *
     * @var \Drupal\openid_connect\OpenIDConnectClaims
     */
    protected $claims;

    /**
     * The constructor.
     *
     * @param \Drupal\openid_connect\OpenIDConnectSession $session
     *   The OpenID Connect session service.
     * @param \Drupal\openid_connect\Plugin\OpenIDConnectClientManager $plugin_manager
     *   The plugin manager.
     * @param \Drupal\openid_connect\OpenIDConnectClaims $claims
     *   The OpenID Connect claims.
     */
    public function __construct(
        OpenIDConnectSession $session,
        OpenIDConnectClientManager $plugin_manager,
        OpenIDConnectClaims $claims
    ) {
        $this->session = $session;
        $this->pluginManager = $plugin_manager;
        $this->claims = $claims;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container)
    {
        return new static(
            $container->get('openid_connect.session'),
            $container->get('plugin.manager.openid_connect_client.processor'),
            $container->get('openid_connect.claims')
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'openid_connect_login_form';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $definitions = $this->pluginManager->getDefinitions();

        foreach ($definitions as $client_id => $client) {
            if (!$this->config('openid_connect.settings.' . $client_id)
                ->get('enabled')) {
                continue;
            }

            $title = "";

            if ( strtolower($client['label']) == "facebook"  ){
                // icon goes here
                $title = "Login with facebook";
            }

            if ( strtolower($client['label']) == "generic"  ){
                // login text goes here
                $title = "Login with email";
            }

            $form['actions']['openid_connect_client_' . $client_id . '_login'] = [
                '#type'     => 'submit',
                '#name'     => $client_id,
                '#value'    => $title,
                '#attributes' => [
                    'class' => [
                        'button',
                        'button--dark',
                    ]
                ],
            ];
        }

        $form['actions']['selected_field'] = [
            '#type'     => 'textfield',
            '#name'     => 'selected_field',
        ];

        $form['#attached']['library'][] = 'openid_connect/form_lib';

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {

        $this->session->saveDestination();
        $client_name = $form_state->getValue('selected_field');

        $configuration = $this->config('openid_connect.settings.' . $client_name)
            ->get('settings');

        $client = $this->pluginManager->createInstance(
            $client_name,
            $configuration
        );

        $scopes = $this->claims->getScopes();
        $_SESSION['openid_connect_op'] = 'login';
        $response = $client->authorize($scopes, $form_state);

        $form_state->setResponse($response);
    }

}

