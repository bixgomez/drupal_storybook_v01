import TwigSiteFooter from './site-footer.local.twig'
import SiteFooterDocs from '!!raw-loader!./site-footer.docs.mdx'

export default {
	title: 'Organisms/Site Footer',
	parameters: {
		componentSubtitle: 'An example of a site footer.',
		docs: {
			description: {
				component: SiteFooterDocs,
			},
		},
	},
	argTypes: {},
	args: {},
}

const Template = ({ }) => TwigSiteFooter({ })

export const SiteFooter = Template.bind({})
