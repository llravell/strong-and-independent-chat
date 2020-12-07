import Component from '../../core/component/index.js';
import Templator from '../../core/templator/index.js';
import MyButton from '../../components/MyButton/index.js';
import Field from '../../components/Field/index.js';
import { signinTemplate } from './signin.template.js';
;
export default class Signin extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.templator = new Templator(signinTemplate, {
            components: {
                'my-button': MyButton,
                'field': Field,
            },
        });
    }
    render() {
        return this.templator.render(this.props);
    }
}
;
//# sourceMappingURL=Signin.js.map