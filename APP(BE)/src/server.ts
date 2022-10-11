import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import FriendsRoute from '@routes/friends.route';
import ChatroomRoute from '@routes/chatroom.route';
import validateEnv from '@utils/validateEnv';
import MessagesRoute from './routes/messages.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new FriendsRoute(), new ChatroomRoute(), new MessagesRoute()]);

app.start();
