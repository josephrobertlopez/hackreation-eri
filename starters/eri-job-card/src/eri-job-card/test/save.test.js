/**
 * TDD (Jest via @wordpress/scripts): npm run test:unit
 * The saved markup is what visitors and screen readers get, so test it.
 */
import { renderToString } from '@wordpress/element';
import save from '../save';

// Unit-test save() in isolation: stub the editor package (full editor tests belong in e2e).
jest.mock( '@wordpress/block-editor', () => ( {
	useBlockProps: { save: ( props = {} ) => ( { className: 'wp-block-eri-eri-job-card', ...props } ) },
} ) );

const attributes = { title: 'Dishwasher', employer: 'Cream City Cafe', hours: 20, wage: '14.00', accommodations: 'Flexible schedule' };

describe( 'ERI Job Card save()', () => {
	it( 'renders the job details', () => {
		const html = renderToString( save( { attributes } ) );
		expect( html ).toContain( 'Dishwasher' );
		expect( html ).toContain( '20 h/wk' );
		expect( html ).toContain( 'Flexible schedule' );
	} );

	it( 'gives the card an accessible name', () => {
		expect( renderToString( save( { attributes } ) ) ).toContain( 'aria-label="Dishwasher at Cream City Cafe"' );
	} );
} );
