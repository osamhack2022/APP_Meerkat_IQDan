import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../common/types";

type AllClearStatistics = StackScreenProps<RootStackParamList, 'AllClearStatistics'>;

export default function UnreadPeoples(props: AllClearStatistics) {
    // params
    const {navigation} = props;
    const {messageId} = props.route.params;

    return(<></>)
}