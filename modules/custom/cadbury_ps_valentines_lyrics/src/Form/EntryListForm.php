<?php


namespace Drupal\cadbury_ps_valentines_lyrics\Form;


use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Render\FormattableMarkup;

use Drupal\Core\Url;
use Drupal\node\Entity\Node;
use Drupal\cadbury_ps_valentines_lyrics\Models\Entry;

/**
 * Class SettingsForm
 * @package Drupal\cadbury_ps_valentines_lyrics\Form
 */

class EntryListForm extends FormBase{

    const PAGE_SIZE = 24;

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
        return "cadbury_ps_valentines_lyrics_list";
    }

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames() {
        return ['cadbury_ps_valentines_lyrics.settings'];
    }

    /**
     * {@inheritdoc}
     */
    public function validateForm(array &$form, FormStateInterface $form_state) {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state) {

        $base = \Drupal::request()->getBaseUrl() . "/" . drupal_get_path('module', 'cadbury_ps_valentines_lyrics');
        $ajax_base = \Drupal::request()->getBaseUrl();

        // Add the admin JS
        $form['#attached']['library'][] = 'cadbury_ps_valentines_lyrics/admin';
        $form['#attached']['drupalSettings']['ajaxBase'] = $ajax_base;

        // Get all the entries
        $query = \Drupal::database()->select('cadbury_ps_valentines_lyrics_entry', 'entries')->orderBy('created', 'DESC');
        $query->fields('entries', ['id','meta_lyrics','created', 'moderated', 'starred', 'selected', 'entry_email', 'meta_song_name', 'meta_message']);
        $pager = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit( self::PAGE_SIZE );
        $results = $pager->execute()->fetchAll();

        $form['actions']['download']['all'] = [
            '#type'             => 'html_tag',
            "#tag"              =>  'a',
            '#value'            => 'Download All',
            '#attributes'       =>  [
                'href'      =>  \Drupal::request()->getBaseUrl() . '/admin/valentines/download/all',
                'class'     =>  'button button--primary',
                'target'    =>  '_blank',
            ],
        ];

        $form['actions']['download']['starred'] = [
            '#type'             => 'html_tag',
            "#tag"              =>  'a',
            '#value'            => 'Download Starred',
            '#attributes'       =>  [
                'href'      =>  \Drupal::request()->getBaseUrl() . '/admin/valentines/download/starred',
                'class'     =>  'button button--primary',
                'target'    =>  '_blank',
            ],
        ];

        $form['actions']['download']['selected'] = [
            '#type'             => 'html_tag',
            "#tag"              =>  'a',
            '#value'            => 'Download Selected',
            '#attributes'       =>  [
                'href'      =>  \Drupal::request()->getBaseUrl() . '/admin/valentines/download/selected',
                'class'     =>  'button button--primary',
                'target'    =>  '_blank',
            ],
        ];

        $form['spacer'] = [
            '#type'     => 'html_tag',
            '#tag'      => 'p',
            '#value'    => '',
        ];

        $header = [
            "meta_message"  =>  "Language",
            "email"         =>  "Email",
            "song_name"     =>  "Song Name",
            "lyrics"        =>  "Lyrics",
            "created"       =>  "Created",
            "moderated"     =>  "Moderated",
            "starred"       =>  "Starred",
            "selected"      =>  "Selected",
            "view"          =>  "View",
        ];

        $output = [];
        foreach ($results as $result):

            $output[$result->id] = [
                "meta_message"  =>  Entry::getLanguageString($result->meta_message),
                "email"         =>  $result->entry_email,
                "song_name"     =>  $result->meta_song_name,
                "lyrics"        =>  strlen($result->meta_lyrics) > 20 ? substr($result->meta_lyrics,0,50) . "..." : $result->meta_lyrics,
                "created"       =>  $result->created,
                "moderated"     =>  $result->moderated == 1 ? new FormattableMarkup('<div data-set="1" data-mode="moderated" data-id="' . $result->id . '" class="v-cross active"></div>',[]) : new FormattableMarkup('<div data-set="0" data-mode="moderated" data-id="' . $result->id . '" class="v-cross"></div>',[]),
                "starred"       =>  $result->starred == 1 ? new FormattableMarkup('<div data-set="1" data-mode="starred" data-id="' . $result->id . '" class="v-star active"></div>',[]) : new FormattableMarkup('<div data-set="0" data-mode="starred" data-id="' . $result->id . '" class="v-star"></div>',[]),
                "selected"      =>  $result->selected == 1 ? new FormattableMarkup('<div data-set="1" data-mode="selected" data-id="' . $result->id . '" class="v-cross active"></div>',[]) : new FormattableMarkup('<div data-set="0" data-mode="selected" data-id="' . $result->id . '"  class="v-cross"></div>',[]),
                "view"          =>  new FormattableMarkup('<a type="button" href="' . $ajax_base . '/admin/valentines/view/' . $result->id . '" class="button">View</a>', []),
            ];
            
        endforeach;

        $form['table'] = [
            '#type'     => 'tableselect',
            '#header'   => $header,
            '#options'  => $output,
            '#empty'    => t('No results'),
        ];

        $form['pager'] = array(
            '#type' => 'pager'
        );

        return $form;

    }


}