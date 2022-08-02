export default function getCurrentColor(score: number) {
  if (score < 5) return { background: 0xeb_eb_eb, spike: 0x80_80_80 }
  if (score < 10) return { background: 0xdc_ec_f1, spike: 0x62_75_81 }
  if (score < 15) return { background: 0xf8_eb_e3, spike: 0x82_6c_61 }
  if (score < 20) return { background: 0xe8_f1_df, spike: 0x75_7c_64 }
  if (score < 25) return { background: 0xe8_e4_f7, spike: 0x6b_66_80 }
  if (score < 30) return { background: 0x76_76_75, spike: 0xfc_f9_fe }
  if (score < 35) return { background: 0x2b_69_7f, spike: 0x63_d1_f8 }
  if (score < 40) return { background: 0x1e_72_00, spike: 0x6e_cf_00 }
  if (score < 45) return { background: 0x00_29_8a, spike: 0x32_8a_ff }
  if (score < 50) return { background: 0x8c_0f_3e, spike: 0xfe_1f_67 }
  if (score < 55) return { background: 0xff_a9_2c, spike: 0xff_ff_ff }
  if (score < 60) return { background: 0x00_97_ff, spike: 0xff_ff_ff }
  if (score < 65) return { background: 0xb0_4d_ff, spike: 0xff_ff_ff }
  if (score < 70) return { background: 0x81_cc_12, spike: 0xff_ff_ff }
  if (score < 75) return { background: 0x00_00_00, spike: 0xff_ff_ff }
  if (score < 80) return { background: 0xed_a8_c8, spike: 0x00_00_00 }
  if (score < 85) return { background: 0x9c_c1_eb, spike: 0x00_00_00 }
  if (score < 90) return { background: 0xb8_e3_9c, spike: 0x00_00_00 }
  if (score < 95) return { background: 0xab_a4_f1, spike: 0x00_00_00 }
  if (score < 100) return { background: 0x98_dd_dd, spike: 0x00_00_00 }
  if (score >= 100) return { background: 0x00_00_00, spike: 0xff_19_00 }
  return { background: 0xeb_eb_eb, spike: 0x80_80_80 }
}
