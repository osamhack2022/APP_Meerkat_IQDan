import { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import api from '../../common/api';
import { User } from '../../common/types';
import { Ionicons } from '@expo/vector-icons';

type SelectedFriendsProp = {
  selectedFriends: number[];
  setSelectedFriends: Function;
};

export default function SelectFriends(props: SelectedFriendsProp) {
  const { selectedFriends, setSelectedFriends } = props;
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    api
      .get('/chatroom/getAllFriends')
      .then(res => {
        setFriends(res.data.data);
      })
      .catch(err => {
        Alert.alert('오류가 발생했습니다.');
      });
  }, []);

  const isIdSelected = (userId: number) => {
    return selectedFriends.includes(userId);
  };

  const handleClick = (userId: number) => {
    if (isIdSelected(userId)) {
      // remove
      setSelectedFriends((prev: number[]) =>
        prev.filter((id: number) => id !== userId),
      );
    } else {
      // add
      setSelectedFriends((prev: number[]) => [...prev, userId]);
    }
  };

  return (
    <View style={{elevation: -1, zIndex: -1}}>
      {/* TODO: height 고정값이면 다른 폰에서 안보일 수 있음.*/}
      <ScrollView style={{ height: 500 }}> 
        {friends.map(friend => {
          return (
            <TouchableOpacity
              key={friend.userId}
              style={styles.friendSelect}
              onPress={() => handleClick(friend.userId)}
            >
              <Image
                style={styles.profileImage}
                // TODO: 각자의 이미지로 변경.
                source={require('../../assets/users/emptyProfile.jpg')}
              />
              <Text style={styles.friendText}>
                {friend.militaryRank} {friend.name}
              </Text>
              {isIdSelected(friend.userId) ? (
                <Ionicons
                  style={styles.radio}
                  name="radio-button-on"
                  size={24}
                  color="#6A4035"
                />
              ) : (
                <Ionicons
                  style={styles.radio}
                  name="radio-button-off"
                  size={24}
                  color="#6A4035"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  friendSelect: {
    height: 50,
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    
  },
  friendText: {
    fontSize: 19,
    fontFamily: 'noto-med',
    lineHeight: 50,
  },
  radio: {
    marginTop: 10,
    marginRight: 10,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 17,
  },
});
