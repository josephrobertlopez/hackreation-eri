import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, employer, hours, wage, accommodations } = attributes;
	return (
		<article { ...useBlockProps.save() } aria-label={ `${ title } at ${ employer }` }>
			<h3>{ title }</h3>
			<p>{ employer } · { hours } h/wk · ${ wage }/h</p>
			<p><strong>Accommodations:</strong> { accommodations }</p>
		</article>
	);
}
