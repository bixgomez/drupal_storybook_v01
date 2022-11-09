import TwigBasicPage from './basic-page.local.twig'
import BasicPageDocs from '!!raw-loader!./basic-page.docs.mdx'

export default {
	title: 'Pages/Basic Page',
}

const Template = () => TwigBasicPage()

export const BasicPage = Template.bind({})
