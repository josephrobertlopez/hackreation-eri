import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { title, employer, hours, wage, accommodations } = attributes;
	const field = ( key, label, type = 'text' ) => (
		<TextControl
			label={ label }
			type={ type }
			value={ attributes[ key ] }
			onChange={ ( v ) => setAttributes( { [ key ]: type === 'number' ? Number( v ) : v } ) }
		/>
	);
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Job details', 'eri-job-card' ) }>
					{ field( 'title', 'Job title' ) }
					{ field( 'employer', 'Employer' ) }
					{ field( 'hours', 'Hours per week', 'number' ) }
					{ field( 'wage', 'Wage per hour' ) }
					{ field( 'accommodations', 'Accommodations offered' ) }
				</PanelBody>
			</InspectorControls>
			<article { ...useBlockProps() }>
				<p className="eri-hello">{ __( 'Hello, ERI!', 'eri-job-card' ) }</p>
				<h3>{ title }</h3>
				<p>{ employer } · { hours } h/wk · ${ wage }/h</p>
				<p><strong>{ __( 'Accommodations:', 'eri-job-card' ) }</strong> { accommodations }</p>
			</article>
		</>
	);
}
