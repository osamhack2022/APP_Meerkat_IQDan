import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import FriendsRoute from '@routes/friends.route';
import ChatroomRoute from '@routes/chatroom.route';
import validateEnv from '@utils/validateEnv';
import MessagesRoute from './routes/messages.route';
import AllClearRoutes from './routes/allclear.route';

validateEnv();

// router 사용 시 해당 list에 넣어야 합니다.
const routes = [
    new IndexRoute(), new UsersRoute(), new AuthRoute(),
    new FriendsRoute(), new ChatroomRoute(), new MessagesRoute(),
    new AllClearRoutes()
];

const app = new App(routes);

app.start();
