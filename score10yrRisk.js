function score10yrRisk (inputs) {

    var age = inputs.age;
    var sex = inputs.sex;
    var sbp = inputs.sbp;
    var chol = inputs.chol;
    var smoke = inputs.smoke;
    var risk = inputs.risk;
    
    
    
    // attach error message if input arguments are out of range
//    scoreArray.CHDRisk = "ERROR: Input out of range";
//    scoreArray.NonCHDRisk = "ERROR: Input out of range";
//    scoreArray.TotalRisk = "ERROR: Input out of range";
//    
   
    calculateRisk(age, sex, smoke, sbp, chol, risk);
    
    return scoreArray;
}    

function calculateRisk (age, sex, smoke, sbp, chol, risk) {
        // Output Array
        var scoreArray = {
            CHDRisk: -5,
            NonCHDRisk: -5,
            TotalRisk: -5,

        };
    
        //assign alpha and p coefficients
        var coefficientsCHD = {
             "low-m-alpha":0,
             "low-m-p":1,
             "low-f-alpha":0,
             "low-f-p":0,
             "high-m-alpha":0,
             "high-m-p":1,
             "high-f-alpha":0,
             "high-f-p":0
        }
        
        var coefficientsNon = {
             "low-m-alpha":0,
             "low-m-p":1,
             "low-f-alpha":0,
             "low-f-p":0,
             "high-m-alpha":0,
             "high-m-p":1,
             "high-f-alpha":0,
             "high-f-p":0
        }
    
       
        //calculate CHD Risk
        var alphaCHD = coefficientsCHD[risk + "-" + sex + "-alpha"];
        var pCHD = coefficientsCHD[risk + "-" + sex + "-p"];
        var w = ((0.24) * (chol - 6)) + ((0.018) * (sbp - 120)) + (0.71 * smoke);
        
            
            var s_sub_0_age = Math.exp(-1 * Math.exp(alphaCHD) * (Math.pow(age - 20),(pCHD)));
            var s_sub_0_age10 = Math.exp(-1 * Math.exp(alphaCHD) * (Math.pow(age - 10),(pCHD)));
        
            var s_age = Math.pow(s_sub_0_age, Math.exp(w));
            var s_age10 = Math.pow(s_sub_0_age10, Math.exp(w));
        
            //output
            scoreArray.CHDRisk = 1-(s_age10/s_age);
        
        
        //calculate non-CHD CVD Risk
        var alphaNon = coefficientsNon[risk + "-" + sex + "-alpha"];
        var pNon = coefficientsNon[risk + "-" + sex + "-p"];
        var wNon = ((0.02) * (chol - 6)) + ((0.022) * (sbp - 120)) + (0.63 * smoke);
        
        var s_sub_0_ageNon = Math.exp(-1 * Math.exp(alphaNon) * (Math.pow(age - 20),(pNon)));
        var s_sub_0_age10Non = Math.exp(-1 * Math.exp(alphaNon) * (Math.pow(age - 10),(pNon)));
        
            var s_ageNon = Math.pow(s_sub_0_ageNon, Math.exp(wNon));
            var s_age10Non = Math.pow(s_sub_0_age10Non, Math.exp(wNon));
        
            //output
            scoreArray.NonCHDRisk = 1-(s_age10Non/s_ageNon);
            scoreArray.TotalRisk = scoreArray.CHDRisk + scoreArray.NonCHDRisk;
            
        
        return scoreArray; 
}