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

class EntryForm extends FormBase{
    /**
     * {@inheritdoc}
     */
    public function getFormId() {
        return "cadbury_ps_valentines_lyrics_entry";
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {

        $current_path = \Drupal::request()->getPathInfo();
        $path_args = explode('/', $current_path);
        $id = end($path_args);

        $model = Entry::loadById($id, Entry::tableName(), new Entry);

        /*
        $model->entry_name = $form_state->getValue('entry_name');
        $model->entry_email = $form_state->getValue('entry_email');
        $model->entry_mobile = $form_state->getValue('entry_mobile');
        $model->meta_song_name = $form_state->getValue('meta_song_name');
        */
        
        $model->moderated = $form_state->getValue('moderated');
        $model->starred = $form_state->getValue('starred');
        $model->selected = $form_state->getValue('selected');

        $model->save();
        drupal_set_message('Saved');

        $form_state->setRedirect('cadbury.valentines.entry.admin');

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
    public function buildForm(array $form, FormStateInterface $form_state) {

        // Get the ID from the URL
        $current_path = \Drupal::request()->getPathInfo();
        $path_args = explode('/', $current_path);
        $id = end($path_args);

        // Get the entry
        $query = \Drupal::database()
            ->select( 'cadbury_ps_valentines_lyrics_entry' , 'result', [])
            ->condition('id', $id, '=')
            ->fields('result');

        $entry = $query->execute()->fetch();

        $form['meta_message'] = [
            '#type'             => 'textfield',
            '#title'            => 'Message',
            '#default_value'    => Entry::getLanguageString($entry->meta_message),
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['meta_song_name'] = [
            '#type'             =>  'textfield',
            '#title'            =>  'Song Name',
            '#default_value'    =>  $entry->meta_song_name,
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['entry_name'] = [
            '#type'             =>  'textfield',
            '#title'            =>  'User Name',
            '#default_value'    =>  $entry->entry_name,
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['entry_email'] = [
            '#type'             =>  'textfield',
            '#title'            =>  'User Email',
            '#default_value'    =>  $entry->entry_email,
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['entry_mobile'] = [
            '#type'             =>  'textfield',
            '#title'            =>  'User Mobile',
            '#default_value'    =>  $entry->entry_mobile,
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['meta_lyrics'] = [
            '#type'             =>  'textarea',
            '#title'            =>  'Lyrics',
            '#default_value'    =>  $entry->meta_lyrics,
            '#attributes'       => [
                "readonly"  =>  "readonly",
                "disabled"  =>  "disabled",
            ],
        ];

        $form['moderated'] = [
            '#type'                 =>  'checkbox',
            '#title'                =>  'Moderated',
            '#default_value'        =>  $entry->moderated,
            '#attributes'           =>  [ "checked"  =>  $entry->moderated == 1 ? true : false ],
        ];

        $form['starred'] = [
            '#type'                 =>  'checkbox',
            '#title'                =>  'Starred',
            '#default_value'        =>  $entry->starred,
            '#attributes'           =>  [ "checked"  =>  $entry->starred == 1 ? true : false ],
        ];

        $form['selected'] = [
            '#type'                 =>  'checkbox',
            '#title'                =>  'Selected',
            '#default_value'        =>  $entry->selected,
            '#attributes'           =>  [ "checked"  =>  $entry->selected == 1 ? true : false ],
        ];

        $form['actions']['#type'] = 'actions';
        $form['actions']['submit'] = [
            '#type'                 => 'submit',
            '#default_value'        => 'Save',
            '#button_type'          => 'primary',
        ];
        
        return $form;

    }

}