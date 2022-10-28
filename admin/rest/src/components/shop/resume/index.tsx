import React from 'react';
import {
  Text,
  Font,
  Page,
  View,
  Image,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

import Header from './Header';

import Experience from './Experience';
import { IUserCompanyData } from '../LegalPDF';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
  },
  image: {
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: 'column',
    width: 170,
    paddingTop: 30,
    paddingRight: 15,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
    textAlign: 'center',
    marginTop: 15,
    paddingTop: 5,
    borderWidth: 3,
    borderColor: 'gray',
    borderStyle: 'dashed',
    '@media orientation: landscape': {
      marginTop: 10,
    },
  },
});

Font.register({
  family: 'Open Sans',
  src: `https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf`,
});

Font.register({
  family: 'Lato',
  src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
});

Font.register({
  family: 'Lato Italic',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf`,
});

Font.register({
  family: 'Lato Bold',
  src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
});

const Resume = ({ userData, ...props }: any) => (
  <Page {...props} style={styles.page}>
    <Header userData={userData} />
    <View style={styles.container}>
      {/* <View style={styles.leftColumn}>
        <Image src={userData?.shops[0]?.logo?.original} style={styles.image} />
      </View> */}
      <Experience userData={userData} />
    </View>
    <Image
      src={
        process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
        userData?.company?.dni_document?.DNI_document_path?.slice(1)
      }
      style={styles.image}
    />
    <Image
      src={
        process.env.NEXT_PUBLIC_REST_API_ENDPOINT +
        userData?.company?.legal_representative?.dni_document?.DNI_document_path?.slice(
          1
        )
      }
      style={styles.image}
    />
  </Page>
);

export default function ResumeWrapper({
  userData,
}: {
  userData: IUserCompanyData;
}) {
  console.log(userData?.shops[0]?.logo?.original);
  return (
    <Document
      author={userData.name}
      keywords="awesome, resume, start wars"
      subject="The resume of Luke Skywalker"
      title="Resume"
    >
      <Resume size="A4" userData={userData} />
    </Document>
  );
}
