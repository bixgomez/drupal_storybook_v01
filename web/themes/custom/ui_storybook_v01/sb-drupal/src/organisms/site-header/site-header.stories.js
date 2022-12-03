import TwigSiteHeader from './site-header.local.twig'
import SiteHeaderDocs from '!!raw-loader!./site-header.docs.mdx'

export default {
	title: 'Organisms/Site Header',
	parameters: {
		componentSubtitle: 'An example of how to implement the site header.',
		docs: {
			description: {
				component: SiteHeaderDocs,
			},
		},
	},
}

const Template = ({ }) => TwigSiteHeader({ })

export const SiteHeader = Template.bind({})
