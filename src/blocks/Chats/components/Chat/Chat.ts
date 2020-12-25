import Component, {IState} from '../../../../core/component/index.js';
import Templator from '../../../../core/templator/index.js';
import {IChat} from '../../../../store.js';
import {chatTemplate} from './chat.template.js';

interface IChatProps {
  chat: IChat | null,
  sendMessage: (e: Event) => any,
};

interface IChatState extends IState {
  showUserOptions: boolean,
};

interface IChatProps {
  chat: IChat | null,
  sendMessage: (e: Event) => any,
};

const templator = Templator.compile(chatTemplate);

export default class Chat extends Component<IChatProps, IChatState> {

  constructor(props: IChatProps) {
    super(props);

    this.state = {
      showUserOptions: false,
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', this.userOptionsOutsideClick);
  }

  beforeDestroy() {
    document.body.removeEventListener('click', this.userOptionsOutsideClick);
  }

  get userOptionsClass() {
    const defaultClass = 'options user-bar__options';
    return this.state.showUserOptions ? defaultClass : `${defaultClass} hidden`;
  }

  get chatClass() {
    return this.props.chat ? 'chat' : 'chat hidden';
  }

  get title() {
    const {chat} = this.props;
    return chat && chat.title || '';
  }

  userOptionsOutsideClick = (e: Event) => {
    if (!(e.target as HTMLElement).closest('[data-click="ignore"]')) {
      console.log('catch!');
      this.setState({showUserOptions: false});
    }
  }

  openUserOptions = () => {
    this.setState({showUserOptions: true});
  }

  render() {
    return templator({
      title: this.title,
      chatClass: this.chatClass,
      userOptionsClass: this.userOptionsClass,
      openUserOptions: this.openUserOptions,
      sendMessage: this.props.sendMessage,
    });
  }
};