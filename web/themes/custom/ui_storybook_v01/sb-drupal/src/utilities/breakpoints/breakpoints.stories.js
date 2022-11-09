import TwigBreakpoints from './breakpoints.local.twig'
import BreakpointsDocs from '!!raw-loader!./breakpoints.docs.mdx'
import TwigColors from "../colors/colors.local.twig";

export default {
	title: 'Utilities/Breakpoints',
	parameters: {
		componentSubtitle: 'Standardized viewport width ranges',
		docs: {
			description: {
				component: BreakpointsDocs,
			},
		},
		controls: { disabled: true },
	},
}

const Template = ({ breakpoints }) => TwigBreakpoints({ breakpoints })

export const Breakpoints = Template.bind({})
