import Component from '@core/component';
import MyButton from '@components/MyButton';
import Field from '@components/Field';
import Modal from '@components/Modal';
import Templator from '@core/templator'
import {addChatModalTemplate} from './add-chat-modal.template';
import {
  FormValidator,
  textFiledScheme,
  IFormState,
} from '@core/validation';

import './AddChatModal.scss';

interface IAddChatModalProps {
  show: boolean,
  onClose: () => void,
  addChat: (title: string) => Promise<unknown>,
}

interface IAddChatModalState {
  title: string,
  formState: IFormState,
  fetching: boolean,
}

const templator = Templator.compile(addChatModalTemplate, {
  components: {
    'my-button': MyButton,
    'modal': Modal,
    'field': Field,
  }
});

export default class AddChatModal extends Component<IAddChatModalProps, IAddChatModalState> {
  private addChatValidator: FormValidator;

  constructor(props: IAddChatModalProps) {
    super(props);

    this.addChatValidator = new FormValidator({
      title: textFiledScheme,
    });

    this.state = {
      title: '',
      formState: this.addChatValidator.formState,
      fetching: false
    };
  }

  clearFormState() {
    this.addChatValidator.clearState();
    this.setState({formState: this.addChatValidator.formState});
  }

  validateTitle(value: string) {
    this.addChatValidator.validate('title', value);
    this.setState({formState: this.addChatValidator.formState});
  }

  onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    this.setState({title: target.value});
  }

  onFocusout = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.tagName !== 'INPUT') return;
    
    this.validateTitle(target.value)
  }

  onSubmit = (e: Event) => {
    e.preventDefault();
    
    this.validateTitle(this.state.title); 
    
    if (this.addChatValidator.valid && !this.state.fetching) {
      this.setState({fetching: true});

      this.props.addChat(this.state.title)
        .then(this.onClose)
        .finally(() => this.setState({fetching: false}));
    }
  }

  onClose = () => {
    this.setState({title: ''});
    this.clearFormState();

    this.props.onClose();
  }

  render() {
    return templator({
      show: this.props.show,
      title: this.state.title,
      formState: this.state.formState,
      onClose: this.onClose,
      onInput: this.onInput,
      onFocusout: this.onFocusout,
      onSubmit: this.onSubmit,
    });
  }
}