<?php
/**
 * Created by PhpStorm.
 * User: moyot
 * Date: 2017/01/12
 * Time: 7:49 AM
 */
/**
 * @file
 * Contains Drupal\cadbury_ps_theme_negotiator\Form\MultipleThemeNegotiatorSettingsForm.
 */

namespace Drupal\cadbury_ps_theme_negotiator\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class MultipleThemeNegotiatorSettingsForm
 * @package Drupal\cadbury_ps_theme_negotiator\Form
 */
class MultipleThemeNegotiatorSettingsForm extends ConfigFormBase {


  protected $themeMappings = array();
  protected $options = array();
  protected $addButtonName = 'New Map';
  protected $addButtonKey = 'addButton';
  protected $deleteButtonName = 'Delete Selected';
  protected $deleteButtonKey = 'deleteButton';
  protected $startOfPathKey = 'startOfPath';
  protected $themeNameKey  = 'themeName';
  protected $themeMappingTableKey = 'themeMappingTable';
  protected $actionsKey = 'actions';
  protected $addNewMappingGroupKey = 'addNewMapping';
  protected $tableGroupKey = 'tableGroup';

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'cadbury_ps_theme_negotiator.settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['cadbury_ps_theme_negotiator.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $themeMappings = $this->config('cadbury_ps_theme_negotiator.settings')->get('cadbury_ps_theme_negotiator.themeMappings');;


    $header = [
       $this->startOfPathKey=> $this->t('Start of path'),
       $this->themeNameKey => $this->t('Theme Name'),
    ];


    $themeMappingKeys = array_keys($themeMappings);

    $i = 1;
    foreach ($themeMappingKeys as $themeMappingKey)
    {

      $this->options[$i++] =  [ $this->startOfPathKey => $themeMappingKey, $this->themeNameKey => $themeMappings[$themeMappingKey]];

    }

    $form[$this->actionsKey] = [
      '#type' => 'actions',
    ];

    $form[$this->tableGroupKey] = array(
      '#type' => 'fieldgroup',
      '#title' => $this->t('Current Mappings'),
    );



    $form[$this->tableGroupKey][$this->themeMappingTableKey] = array(
      '#type' => 'tableselect',
      '#caption' => $this->t('Theme Mappings'),
      '#header' => $header,
      '#options' => $this->options,
      '#empty' => $this->t('No mappings found'),
    );

    $form [$this->tableGroupKey][$this->deleteButtonKey] = [
      '#type' => 'submit',
      '#value' => $this->t($this->deleteButtonName),
      '#weight' => 10
    ];

    $form[$this->addNewMappingGroupKey] = array(
      '#type' => 'fieldgroup',
      '#title' => $this->t('Add New Mapping'),
    );





    $form[$this->addNewMappingGroupKey][$this->startOfPathKey] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Start of URL Path')

    );

    $form[$this->addNewMappingGroupKey][$this->themeNameKey] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Theme to be mapped to URL Path')
    );

    // Add a submit button that handles the submission of the form.
    $form [$this->addNewMappingGroupKey][$this->addButtonKey] = [
      '#type' => 'submit',
      '#value' => $this->t($this->addButtonName),
      '#weight' => 10
    ];










    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    // Trim the text values.

    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   * @var $config \Drupal\Core\Config\Config
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $config =  $this->config('cadbury_ps_theme_negotiator.settings');
    $this->themeMappings =   $config->get('cadbury_ps_theme_negotiator.themeMappings');
    $startOfPath = $form_state->getValue('startOfPath');
    $themeName = $form_state->getValue('themeName');
    $userInput = $form_state->getUserInput();
    $operation = $userInput['op'];
    if(   $operation === $this->addButtonName )
    {
      if( ! $this->IsNullOrEmptyString($startOfPath) &&  ! $this->IsNullOrEmptyString($themeName) )
      {
        $this->themeMappings[$startOfPath] = $themeName;
        $this->saveConfig($this->themeMappings);

      }
    }
    else if($operation === $this->deleteButtonName )
    {

      $results = array_filter($form_state->getValue($this->themeMappingTableKey));
      $themeMappingsLengthBeforeDelete = count($this->themeMappings);
      foreach ($results as  $tableItems)
      {

          $selectedRow =  $this->options[$tableItems];
          unset($this->themeMappings[$selectedRow[$this->startOfPathKey]]);

      }
      if( count($this->themeMappings) < $themeMappingsLengthBeforeDelete)
      {
        $this->saveConfig($this->themeMappings);
      }
    }
    else{
      //perform default submit for all other calls to submit
      parent::submitForm($form, $form_state);
    }






  }


  private function saveConfig($values)
  {
    $this->config('cadbury_ps_theme_negotiator.settings')
      ->set('cadbury_ps_theme_negotiator.themeMappings',$values)
      ->save();

  }

  private function IsNullOrEmptyString($question){
    return (!isset($question) || trim($question)==='');
  }


}
