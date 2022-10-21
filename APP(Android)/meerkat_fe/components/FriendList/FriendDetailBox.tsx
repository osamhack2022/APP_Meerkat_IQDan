import { User, UserSummary } from '../../common/types';
import { Text, StyleSheet, View, Image } from 'react-native';
import { getImage } from '../../common/getImage';

const affiliatedUnitImage = require('../../assets/icons/affiliatedUnitIcon.png');
const dogtagImage = require('../../assets/icons/dogtagIcon.png');

export default function FriendDetailBox(props: UserSummary) {
  const user = props;
  return (
    <>
      <View style={styles.mainContainer}>
        <Image style={styles.profileImage} source={getImage(user.image)} />
        <Text style={styles.nameText}>
          {`${user.militaryRank} ${user.name}`}
        </Text>
        <View style={styles.labelGroupContainer}>
          <View style={styles.labelContainer}>
            <View style={styles.labelTagContainer}>
              <Image
                source={affiliatedUnitImage}
                resizeMode="center"
                style={styles.labelTagIcon}
              />
              <Text style={styles.labelTagText}>소속</Text>
            </View>
            <Text style={styles.labelText}>{user.affiliatedUnit}</Text>
          </View>

          <View style={styles.labelContainer}>
            <View style={styles.labelTagContainer}>
              <Image
                source={dogtagImage}
                resizeMode="center"
                style={styles.labelTagIcon}
              />
              <Text style={styles.labelTagText}>군번</Text>
            </View>
            <Text style={styles.labelText}>{user.serviceNumber}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 24,
  },
  nameText: {
    fontFamily: 'noto-reg',
    fontSize: 20,
  },
  labelGroupContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 60,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 170,
  },
  labelTagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A4035',
    borderRadius: 20,
    width: 80,
  },
  labelTagIcon: {
    width: 24,
    height: 24,
  },
  labelTagText: {
    marginLeft: 5,
    fontFamily: 'noto-reg',
    color: '#FFF9D2',
    fontSize: 14,
    lineHeight: 20,
  },
  labelText: {
    marginLeft: 15,
    fontFamily: 'noto-reg',
    color: 'black',
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userInfoSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
