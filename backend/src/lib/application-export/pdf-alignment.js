export const PDF_ALIGNMENT = {
  residential: {
    text: [
      [163.94], // lotNo
      [176.54], // surveyNo
      [189.26], // landAreaSqm
      [163.94], // specificLocation
      [176.54], // barangay
      [189.26], // municipality
      [201.86], // province
      [268.2], // lastName
      [268.2], // firstName
      [268.2], // middleName
      [303.29], // dateOfBirth
      [328.61], // age
      [356.16], // fullAddress
      [393.65], // spouseName
      [406.25], // citizenship
      [418.97], // contactNo
      [431.57], // email
      [566.35], // occupationDate
      [615.55], // heirPredecessorName
      [615.55], // heirRelationship
      [629.26], // heirDateOfDeath
      [692.14], // transfereePredecessorName
      [705.82], // transferAction
      [719.5], // transactionDate
      [149.42], // employmentMarriageOccupationDate
      [161.415], // marriageWithName
      [244.7], // forceAbsenceOccupationDate
      [377.21], // motherLotOccupationDate
      [619.9], // applicantName
      [301.26], // applicantName
      [410.92], // referenceNo
    ],
    choices: {
      sex: {
        Male: [120.214, 310.906, 5.248, 4.998],
        Female: [161.951, 310.906, 5.248, 4.998],
      },
      civilStatus: {
        Single: [169.199, 375.636, 5.248, 4.998],
        Married: [216.684, 375.636, 5.248, 4.998],
        Divorced: [269.668, 375.636, 5.248, 4.998],
        Separated: [325.152, 375.636, 5.248, 4.998],
        Widowed: [382.884, 375.636, 5.248, 4.998],
      },
    },
  },
  agricultural: {
    text: [
      [165.74], // lotNo
      [177.98], // surveyNo
      [190.22], // landAreaSqm
      [165.74], // specificLocation
      [177.98], // barangay
      [190.22], // municipality
      [202.34], // province
      [263.45], // lastName
      [263.45], // firstName
      [263.45], // middleName
      [287.81], // dateOfBirth
      [312.29], // age
      [324.53], // fullAddress
      [348.89], // spouseName
      [361.13], // citizenship
      [373.25], // contactNo
      [385.49], // email
      [458.71], // cultivationDate
      [495.43, 519.79], // improvementsMade
      [568.63], // firstCultivatorName
      [568.63], // firstCultivationDate
      [629.74], // previousCultivatorName
      [641.86], // previousCultivatorDeathDate
      [666.34, 678.58], // heirImprovements
      [702.94, 715.18], // heirDetailsRelation
      [136.46], // heir1Name
      [136.46], // heir1Address
      [148.7], // heir2Name
      [148.7], // heir2Address
      [160.82], // heir3Name
      [160.82], // heir3Address
      [185.3], // heirRepresentativeName
      [197.54], // heirsOfAncestorName
      [270.77, 283.01], // unoccupiedPeriodAndReason
      [429.41], // witness1Name
      [429.41], // witness1Address
      [478.27], // witness2Name
      [478.27], // witness2Address
      [612.55], // applicantName
      [261.02], // applicantName
      [346.49], // referenceNo
    ],
    choices: {
      sex: {
        Male: [131.96, 295.411, 4.499, 4.499],
        Female: [172.698, 295.411, 4.499, 4.499],
      },
      civilStatus: {
        Single: [144.706, 331.9, 4.499, 4.499],
        Married: [179.696, 331.9, 4.499, 4.499],
        Divorced: [223.932, 331.9, 4.499, 4.499],
        Separated: [271.668, 331.9, 4.499, 4.499],
        Widowed: [324.402, 331.9, 4.499, 4.499],
      },
      naturalBorn: {
        Yes: [394.381, 356.392, 4.499, 4.499],
        No: [416.874, 356.392, 4.499, 4.499],
      },
    },
  },
  chainsaw: {
    text: [
      [151.415], // applicantName
      [182.415], // completeAddress
      [213.415], // email
      [244.415], // contactNo
      [322.415], // registrationType
      [353.415], // brand
      [384.415], // model
      [415.415], // dateOfAcquisition
      [446.415], // serialNumber
      [477.415], // horsePower
      [508.415], // maxGuideBarLength
      [550.51], // applicantName
    ],
    choices: {},
  },
  "tree-cutting": {
    text: [
      [251.415], // applicantName
      [292.415, 304.415], // fullAddress
      [335.415], // email
      [377.415], // contactNo
      [464.415, 476.415], // treeCuttingAddress
      [508.415], // noTreesToBeRemoved
      [601.87], // applicantName
    ],
    choices: {},
  },
};
