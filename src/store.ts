import {Store} from '@core/store';
import {IUser, IChat, IMessage, IError} from '@/types';
import {uniqBy} from '@core/utils';
export interface IStoreState {
  isAuthorized: boolean,
  user: IUser | null;
  chats: IChat[],
  chatMessages: Record<string, IMessage[]>,
  errors: IError[],
}

interface IChatMessagesPayload {
  chatId: number,
  messages: IMessage[],
}

interface INewMessagePayload {
  chatId: number,
  message: IMessage,
}

export const store = new Store<IStoreState>({
  state: {
    user: null,
    isAuthorized: false,
    chats: [],
    chatMessages: {},
    errors: [],
  },

  actions: {
    setUser: (ctx, user: IUser) => {
      ctx.commit('setUser', user);
    },

    setAuthorized: (ctx, value: boolean) => {
      ctx.commit('setAuthorized', value);
    },

    setChats: (ctx, chats: IChat[]) => {
      ctx.commit('setChats', chats);
    },

    pushOldMessages: (ctx, payload: IChatMessagesPayload) => {
      ctx.commit('pushOldMessages', payload);
    },

    pushNewMessage: (ctx, payload: INewMessagePayload) => {
      ctx.commit('pushNewMessage', payload);
    },

    pushError: (ctx, error: IError) => {
      ctx.commit('pushError', error);

      setTimeout(() => {
        ctx.commit('removeError', error);
      }, 5000);
    },

    removeError: (ctx, error: IError) => {
      ctx.commit('removeError', error);
    }
  },

  mutations: {
    setUser: (state, user: IUser) => {
      state.user = user;
    },

    setAuthorized: (state, value: boolean) => {
      state.isAuthorized = value;
    },

    setChats: (state, chats: IChat[]) => {
      state.chats = chats;
    },

    pushOldMessages: (state, payload: IChatMessagesPayload) => {
      const {chatId, messages} = payload;
      const currentMessages = state.chatMessages[chatId] || [];

      const unionMessages = messages.reverse().concat(currentMessages);

      state.chatMessages = {...state.chatMessages, [chatId]: uniqBy<IMessage>(unionMessages, 'id')};
    },

    pushNewMessage: (state, payload: INewMessagePayload) => {
      const {chatId, message} = payload;
      const messages = state.chatMessages[chatId] || [];

      state.chatMessages = {...state.chatMessages, [chatId]: [...messages, message]};
    },

    pushError: (state, error: IError) => {
      state.errors = [...state.errors, error];
    },

    removeError: (state, error: IError) => {
      state.errors = state.errors.filter((_error) => _error !== error);
    }
  }
});