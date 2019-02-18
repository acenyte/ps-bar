<?php
/**
 * Created by PhpStorm.
 * User: moyot
 * Date: 2017/01/11
 * Time: 9:09 PM
 */

namespace Drupal\cadbury_ps_theme_negotiator\Theme;


use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Path\AliasManagerInterface;
use Drupal\Core\Path\CurrentPathStack;
use  Drupal\Core\Routing\AdminContext;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Theme\ThemeNegotiatorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MultipleThemeNegotiator  implements ThemeNegotiatorInterface {

    /**
     * @param RouteMatchInterface $route_match
     * @return bool
     * version 1.3
     */
    protected $configFactory;
    protected $pathAliasManager;
    protected  $adminContext;
    protected  $currentPathStack;
    const  SETTINGS_KEY = 'cadbury_ps_theme_negotiator.settings';
    const THEME_MAPPING_KEY  = 'cadbury_ps_theme_negotiator.themeMappings';


    public function __construct(ConfigFactoryInterface $config_factory, AliasManagerInterface $path_alias_manager, AdminContext $admin_context, CurrentPathStack $currentPathStack) {

        $this->configFactory = $config_factory;
        $this->pathAliasManager = $path_alias_manager;
        $this->adminContext = $admin_context;
        $this->currentPathStack = $currentPathStack;
    }

    public static function create(ContainerInterface $container) {
        return new static(
            $container->get('config.factory'),
            $container->get('path.alias_myanager'),
            $container->get('router.admin_context'),
            $container->get('path.current')

        );
    }


    public function applies(RouteMatchInterface $route_match)
    {
        $isAdmin = $this->adminContext->isAdminRoute($route_match->getRouteObject());

        return !$isAdmin &&
        $this->negotiateRoute($route_match) ? true : false;
    }
    /**
     * @param RouteMatchInterface $route_match
     * @return null|string
     */
    public function determineActiveTheme(RouteMatchInterface $route_match)
    {


        return $this->negotiateRoute($route_match) ?: null;


    }
    /**
     * Function that does all of the work in selecting a theme
     * @param RouteMatchInterface $route_match
     * @return bool|string
     */
    private function negotiateRoute(RouteMatchInterface $route_match)
    {
        $config = $this->configFactory->get(MultipleThemeNegotiator::SETTINGS_KEY);
        $themeMapping =   $config->get(MultipleThemeNegotiator::THEME_MAPPING_KEY);

        //get the current node id of the request
        $node = $route_match->getParameter('node');


        $pathAlias = NULL;
        $themeName = FALSE;
        if(!empty($node))
        {
            $nodeId = $node->id();
            if($nodeId !== NULL) {
                //what is the path alias of the node. If there is no alias a node the node path will be returned
                $pathAlias = $this->pathAliasManager->getAliasByPath('/node/' . $nodeId);
                $themeName = $this->findTheme($pathAlias,$themeMapping);

            }
        }
        else{
            $pathAlias =  $this->currentPathStack->getPath();

            if(FALSE !== strpos($pathAlias,"/views/ajax"))
            {
                /** TODO: Add Dependency injection */
                $request = \Drupal::requestStack()->getCurrentRequest();
                $ajaxPageState = $request->request->get("ajax_page_state");
                $themeName = $ajaxPageState['theme'];
                if( !isset($themeName) )
                {
                    $themeName = FALSE;
                }
            }
            else{
                $themeName = $this->findTheme($pathAlias,$themeMapping);
            }
        }

        return $themeName;

    }


    private  function findTheme($pathAlias,$themeMapping)
    {


        //get the all the url start strings that we have custom mappings for
        $themeMappingKeys = array_keys($themeMapping);
        $cleanedPathAlias = ltrim($pathAlias,"/");

        foreach ($themeMappingKeys as $themeMappingKey)
        {
            //check if the alias or node path starts with the url start string

            $cleanedThemeMappingKey = ltrim($themeMappingKey,"/");


            if(strpos($cleanedPathAlias,$cleanedThemeMappingKey,0) !== FALSE)
                return $themeMapping[$themeMappingKey];
        }
        //return beyond by default
        return FALSE;
    }

}

