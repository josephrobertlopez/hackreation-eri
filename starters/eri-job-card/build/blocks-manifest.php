<?php
// This file is generated. Do not modify it manually.
return array(
	'eri-job-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'eri/eri-job-card',
		'version' => '0.1.0',
		'title' => 'ERI Job Card',
		'category' => 'widgets',
		'icon' => 'id-alt',
		'description' => 'Hackreation hello-world Gutenberg block',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'eri-job-card',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Dishwasher'
			),
			'employer' => array(
				'type' => 'string',
				'default' => 'Cream City Cafe'
			),
			'hours' => array(
				'type' => 'number',
				'default' => 20
			),
			'wage' => array(
				'type' => 'string',
				'default' => '14.00'
			),
			'accommodations' => array(
				'type' => 'string',
				'default' => 'Flexible schedule; written instructions'
			)
		)
	)
);
