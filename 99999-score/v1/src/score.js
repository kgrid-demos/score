function score10yrRisk(inputs) {
    var outputs = {};
    outputs.comment = validate(inputs);
    outputs.riskOutputs = calculateRisk(inputs);

    return outputs;
}

function validate (inputs) {
    var outputErrors = {};
    if (inputs.age > 65 && inputs.age < 90) { // only calculate between 30 to 90 years old
      outputErrors.age = "ERROR: Input out of range. Age must" +
                          " be within 40 to 65 inclusive. Age set to 65" +
                          " by default.";
    }
   else if (inputs.age < 40 && inputs.age > 30) {
     inputs.age = 40;
     outputErrors.ageError = "ERROR: Input out of range. Age must" +
                         " be within 40 to 65 inclusive. Age set to 40" +
                         " by default.";
   }
   else if (inputs.age <= 30 || inputs.age >= 90) {
     outputErrors.ageError = "ERROR: Input out of range. Age must" +
                         " be within 40 to 65 inclusive";
   }

   if (inputs.sex != "F" && inputs.sex != "M") {
     outputErrors.sexError = "ERROR: Input invalid. Sex must be 'M' or 'F'"
   }
   if (inputs.sbp > 180) { // if > 180 then == 180
     inputs.sbp = 180;

     outputErrors.sbpError = "ERROR: Input out of range. SBP must" +
                         " be within 120 to 180 inclusive. SBP set to 180" +
                         " by default."
   }
   else if (inputs.sbp < 120) {
     inputs.sbp = 120;
     outputErrors.sbpError = "ERROR: Input out of range. SBP must" +
                         " be within 120 to 180 inclusive. SBP set to 120" +
                         " by default."
   }
   if (inputs.chol > 8) { // if > 8 then == 8
     inputs.chol = 8;
     outputErrors.cholError = "ERROR: Input out of range. Cholesterol must" +
                         " be within 4 to 8 inclusive. Cholesterol set to" +
                         " 8 by default."
   }
   else if (inputs.chol < 4) {
     inputs.chol = 4;
     outputErrors.cholError = "ERROR: Input out of range. Cholesterol must" +
                         " be within 4 to 8 inclusive. Cholesterol set to" +
                         " 4 by default."
   }
   if (inputs.smoke != 1 && inputs.smoke != 0) {
     outputErrors.smokError = "ERROR: Input invalid. Smoke status must be 0 for" +
                          " nonsmoker and 1 for smoker."
   }
   if (inputs.risk != "low" && inputs.risk != "high") {
     outputErrors.riskError = "ERROR: Input invalid. Risk must be 'low' or 'high'";
   }

  return outputErrors;
}


function calculateRisk(inputs) {
        var riskOutputs = {}
        //assign alpha and p coefficients
        var coefficientsCHD = {
             "low-M-alpha": -22.1,
             "low-M-p": 4.71,
             "low-F-alpha": -29.8,
             "low-F-p": 6.36,
             "high-M-alpha": -21.0,
             "high-M-p": 4.62,
             "high-F-alpha": -28.7,
             "high-F-p": 6.23
        }

        var coefficientsNon = {
             "low-M-alpha": -26.7,
             "low-M-p": 5.64,
             "low-F-alpha": -31,
             "low-F-p": 6.62,
             "high-M-alpha": -25.7,
             "high-M-p": 5.47,
             "high-F-alpha": -30,
             "high-F-p": 6.42
        }


        //calculate CHD Risk
        var alphaCHD = coefficientsCHD[inputs.risk + "-" + inputs.sex + "-alpha"];
        var pCHD = coefficientsCHD[inputs.risk + "-" + inputs.sex + "-p"];
        var w = ((0.24) * (inputs.chol - 6)) + ((0.018) * (inputs.sbp - 120)) + (0.71 * inputs.smoke);


           var s_sub_0_age = Math.exp(-1 * Math.exp(alphaCHD) * Math.pow((inputs.age - 20),pCHD));
           var s_sub_0_age10 = Math.exp(-1 * Math.exp(alphaCHD) * Math.pow((inputs.age - 10),pCHD));

            var s_age = Math.pow(s_sub_0_age, Math.exp(w));
            var s_age10 = Math.pow(s_sub_0_age10, Math.exp(w));

            // set output CHDRisk
            riskOutputs.CHDRisk = 1-(s_age10/s_age);


        //calculate non-CHD CVD Risk
        var alphaNon = coefficientsNon[inputs.risk + "-" + inputs.sex + "-alpha"];
        var pNon = coefficientsNon[inputs.risk + "-" + inputs.sex + "-p"];
        var wNon = ((0.02) * (inputs.chol - 6)) + ((0.022) * (inputs.sbp - 120)) + (0.63 * inputs.smoke);

        var s_sub_0_ageNon = Math.exp(-1 * Math.exp(alphaNon) * Math.pow((inputs.age - 20),pNon));
        var s_sub_0_age10Non = Math.exp(-1 * Math.exp(alphaNon) * Math.pow((inputs.age - 10),pNon));

            var s_ageNon = Math.pow(s_sub_0_ageNon, Math.exp(wNon));
            var s_age10Non = Math.pow(s_sub_0_age10Non, Math.exp(wNon));

            // set output NonCHDRisk and TotalRisk
            riskOutputs.NonCHDRisk = 1-(s_age10Non/s_ageNon);
            riskOutputs.TotalRisk = riskOutputs.CHDRisk + riskOutputs.NonCHDRisk;

            // truncate each output to 9 decimal places
            riskOutputs.CHDRisk = parseFloat(riskOutputs.CHDRisk.toFixed(9));
            riskOutputs.NonCHDRisk = parseFloat(riskOutputs.NonCHDRisk.toFixed(9));
            riskOutputs.TotalRisk = parseFloat(riskOutputs.TotalRisk.toFixed(9));

        return riskOutputs;
}
