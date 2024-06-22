const Religion = require('../model/Religion');
const Nationality = require('../model/Nationality');
const Gender = require('../model/Gender');
const Department = require('../model/Department');
const Section = require('../model/Section');
const GradeLevel = require('../model/GradeLevel');
const Requirement = require('../model/Requirement');
const Role = require('../model/Roles');
const SchoolYear = require('../model/SchoolYear');
const User = require('../model/Users');
const PaymentTerm = require('../model/PaymentTerm');
const FeeCategory = require('../model/FeeCategory');
const FeeCode = require('../model/FeeCode');
const Parent = require('../model/Parent');
const Student = require('../model/Students');
const Academic = require('../model/Academic');

const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 24 * 60;
const createToken = (token) => {
    return jwt.sign({ token }, process.env.SECRET, {
        expiresIn: maxAge
    })
}

// For Religion
module.exports.get_religions = async (req,res) => {
    try {
        const religions = await Religion.find().populate('inputter');
        res.status(200).json(religions);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_religion = async (req,res) => {

    const { religion,currentUserId: inputter } = req.body

    try {
        const newReligion = await Religion.create({ religion,inputter });
        res.status(200).json({ mssg: `${religion} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_religion = async (req,res) => {
    const { id } = req.params;

    try {
        const religionFind = await Religion.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${religionFind.religion} religion record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_religion_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const religionFind = await Religion.findById(id);
        res.status(200).json(religionFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_religion = async (req,res) => {
    const { id } = req.params;

    const { newReligion: religion,currentUserId: inputter } = req.body;

    try {   
        const currReligion = await Religion.findById(id);
        if(currReligion.religion !== religion) {
            const newReligion = await Religion.findByIdAndUpdate({ _id: id }, { religion,inputter });
            res.status(200).json({ mssg: `${newReligion.religion} has been changed to ${religion} successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${religion}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

// For Nationality

module.exports.get_nationalities = async (req,res) => {
    try {
        const nationalities = await Nationality.find().populate('inputter');
        res.status(200).json(nationalities);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_nationality = async (req,res) => {

    const { nationality,currentUserId: inputter } = req.body

    try {
        const newNationality = await Nationality.create({ nationality,inputter });
        res.status(200).json({ mssg: `${nationality} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_nationality = async (req,res) => {
    const { id } = req.params;

    try {
        const nationalityFind = await Nationality.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${nationalityFind.nationality} nationality record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_nationality_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const nationalityFind = await Nationality.findById(id);
        res.status(200).json(nationalityFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_nationality = async (req,res) => {
    const { id } = req.params;
    const { newNationality: nationality,currentUserId: inputter } = req.body;

    try {
        const currNationality = await Nationality.findById(id);
        if(currNationality.nationality !== nationality) {
            const newNationality = await Nationality.findByIdAndUpdate({ _id: id },{ nationality,inputter });
            res.status(200).json({ mssg: `${newNationality.nationality} has been changed to ${nationality} successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${nationality}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }

}

// For Gender

module.exports.get_genders = async (req,res) => {
    try {
        const genders = await Gender.find().populate('inputter');
        res.status(200).json(genders);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_gender = async (req,res) => {

    const { gender,inputter } = req.body

    try {
        const newGender = await Gender.create({ gender,inputter });
        res.status(200).json({ mssg: `${gender} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_gender = async (req,res) => {
    const { id } = req.params;

    try {
        const genderFind = await Gender.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${genderFind.gender} gender record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_gender_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const genderFind = await Gender.findById(id);
        res.status(200).json(genderFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_gender = async (req,res) => {
    const { id } = req.params;

    const { newGender: gender,currentUserId:inputter } = req.body;
  
    try {   
        const currGender = await Gender.findById(id);
        if(currGender.gender !== gender) {
            const newGender = await Gender.findByIdAndUpdate({ _id: id }, { gender,inputter });
            res.status(200).json({ mssg: `${newGender.gender} has been changed to ${gender} successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${gender}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

// For Department

module.exports.get_departments = async (req,res) => {
    try {
        const departments = await Department.find().populate('inputter session');
        res.status(200).json(departments);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_departments = async (req,res) => {

    const { department,session,currentUserId } = req.body

    try {
        const newDepartment = await Department.create({ department,session,inputter: currentUserId });
        res.status(200).json({ mssg: `${newDepartment.department} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_department = async (req,res) => {
    const { id } = req.params;

    try {
        const departmentFind = await Department.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${departmentFind.department} department record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_department_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const departmentFind = await Department.findById(id);
        res.status(200).json(departmentFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_department = async (req,res) => {
    const { id } = req.params;

    const { newDepartment: department, session, currentUserId: inputter } = req.body;

    try {   
        const currDepartment = await Department.findById(id);
        if(currDepartment.department !== department) {
            const newDepartment = await Department.findByIdAndUpdate({ _id: id }, { department,session,inputter });
            res.status(200).json({ mssg: `${newDepartment.department} has been changed to ${department} successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${department}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

// For Section

module.exports.get_sections = async (req,res) => {
    try {
        const sections = await Section.find({ status: true }).populate('gradeLevel department adviser');
        res.status(200).json(sections);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_sections = async (req,res) => {

    const { section,gradeLevel,department } = req.body;
    const status = true;

    try {
        const newSection = await Section.addSection(section,gradeLevel,department,status);
        res.status(200).json({ mssg: `${newSection.section} has been added to the record` });
    } catch(err) {
        console.log(err);
        res.status(400).json({ mssg: err.message });
    }
}

module.exports.delete_section = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const sectionFind = await Section.findByIdAndUpdate({ _id: id },{ status });
        res.status(200).json({ mssg: `${sectionFind.section} section record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_section_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const sectionFind = await Section.findById(id);
        res.status(200).json(sectionFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_section = async (req,res) => {
    const { id } = req.params;

    const { newSection: section,newGradeLevel: gradeLevel,newAdviser: adviser,newDepartment: department  } = req.body;
   
    try {   
        const currSection = await Section.findById(id);
        // if(currSection.section !== section) {
            const newSection = await Section.findByIdAndUpdate({ _id: id }, { section,gradeLevel,adviser,department });
            res.status(200).json({ mssg: `${newSection.section} has been changed to ${section} successfully!` });
        // } else {
            // res.status(400).json({ mssg: `Cannot update ${section}, still the same with old value` })
        // }
        
    } catch(err) {
        console.log(err);
    }
}

// For Grade Level

module.exports.get_grade_levels = async (req,res) => {
    try {
        const gradeLevels = await GradeLevel.find().populate('inputter department');
        res.status(200).json(gradeLevels);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_grade_levels = async (req,res) => {

    const { gradeLevel,inputter,department } = req.body

    try {
        const newGradeLevel = await GradeLevel.create({ gradeLevel,inputter,department });
        res.status(200).json({ mssg: `${newGradeLevel.gradeLevel} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_grade_level = async (req,res) => {
    const { id } = req.params;

    try {
        const gradeLevelFind = await GradeLevel.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${gradeLevelFind.gradeLevel} grade level record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_grade_level_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const gradeLevelFind = await GradeLevel.findById(id);
        res.status(200).json(gradeLevelFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_grade_level = async (req,res) => {
    const { id } = req.params;

    const { newGradeLevel: gradeLevel,inputter,department } = req.body;

    try {   
        const currGradeLevel = await GradeLevel.findById(id);
        if(currGradeLevel.gradeLevel !== GradeLevel) {
            const newGradeLevel = await GradeLevel.findByIdAndUpdate({ _id: id }, { gradeLevel,inputter,department });
            res.status(200).json({ mssg: `${newGradeLevel.gradeLevel} has been updated successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${gradeLevel}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

// For Requirement

module.exports.get_requirements = async (req,res) => {
    try {
        const requirements = await Requirement.find().populate('inputter');
        res.status(200).json(requirements);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_requirements = async (req,res) => {

    const { requirement,isRequired,currentUserId } = req.body

    try {
        const newRequirement = await Requirement.create({ requirement,isRequired,inputter: currentUserId });
        res.status(200).json({ mssg: `${newRequirement.requirement} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_requirement = async (req,res) => {
    const { id } = req.params;

    try {
        const requirementFind = await Requirement.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${requirementFind.requirement} requirement record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_requirement_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const requirementFind = await Requirement.findById(id);
        res.status(200).json(requirementFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_requirement = async (req,res) => {
    const { id } = req.params;

    const { newRequirement: requirement,newIsRequired: isRequired,currentUserId: inputter } = req.body;

    try {   
        const currRequirement = await Requirement.findById(id);
        // if(currRequirement.requirement !== requirement && currRequirement.isRequired !== isRequired) {
            const newRequirement = await Requirement.findByIdAndUpdate({ _id: id }, { requirement,isRequired,inputter });
            res.status(200).json({ mssg: `${newRequirement.requirement} has been changed to ${requirement} successfully!` });
        // } else {
        //     res.status(400).json({ mssg: `Cannot update ${requirement}, still the same with old value` })
        // }
        
    } catch(err) {
        console.log(err);
    }
}

// For Roles

module.exports.get_roles = async (req,res) => {
    try {
        const roles = await Role.find({ status: true }).populate('inputter');
        res.status(200).json(roles);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_roles = async (req,res) => {

    const { userRole,currentUserId: inputter } = req.body;
    const status = true

    try {
        const newRole = await Role.addRole(userRole,inputter,status);
        res.status(200).json({ mssg: `${newRole.userRole} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_role = async (req,res) => {
    const { id } = req.params;
    const status = false;

    try {
        const roleFind = await Role.findByIdAndUpdate({ _id:id },{ status });
        res.status(200).json({ mssg: `${roleFind.userRole} user role record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_role_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const roleFind = await Role.findById(id);
        res.status(200).json(roleFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_role = async (req,res) => {
    const { id } = req.params;

    const { newUserRole: role,currentUserId: inputter } = req.body;
    console.log(req.body);

    try {   
        const currRole = await Role.findById(id);
        if(currRole.role !== role) {
            const newRole = await Role.findByIdAndUpdate({ _id: id }, { userRole:role,inputter });
            res.status(200).json({ mssg: `${newRole.userRole} has been changed to ${role} successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${role}, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

// For School Year

module.exports.get_school_years = async (req,res) => {
    try {
        const schoolYears = await SchoolYear.find();
        res.status(200).json(schoolYears);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_school_year = async (req,res) => {

    const { syTheme,yearEnd,yearStart } = req.body;
    const isYearDone = false;

    try {
        const newSy = await SchoolYear.create({ schoolTheme: syTheme, endYear:yearEnd, startYear:yearStart,isYearDone });
        res.status(200).json({ mssg: `${newSy.startYear} to ${newSy.endYear} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_school_year = async (req,res) => {
    const { id } = req.params;

    try {
        const schoolYearFind = await SchoolYear.findByIdAndUpdate({ _id: id },{ isYearDone: true });
        res.status(200).json({ mssg: `${schoolYearFind.startYear.split('-')[0]} to ${schoolYearFind.endYear.split('-')[0]} year has ended` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_school_year_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const schoolYearFind = await SchoolYear.findById(id);
        res.status(200).json(schoolYearFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_school_year = async (req,res) => {
    const { id } = req.params;

    const { newSchoolTheme: schoolTheme, newEndYear:endYear, newStartYear:startYear,isYearDone } = req.body;

    try {   
        const currSchoolYear = await SchoolYear.findById(id);
        // if(currSchoolYear.syTheme !== syTheme) {
            const newSchoolYear = await SchoolYear.findByIdAndUpdate({ _id: id }, { schoolTheme,startYear,endYear,isYearDone });
            res.status(200).json({ mssg: `${newSchoolYear.startYear.split('-')[0]} to ${newSchoolYear.endYear.split('-')[0]} has been edited successfully!` });
        // } else {
        //     res.status(400).json({ mssg: `Cannot update ${syTheme}, still the same with old value` })
        // }
        
    } catch(err) {
        console.log(err);
    }
}

// For Users

module.exports.get_users = async (req,res) => {
    try {
        const users = await User.find().populate('role');
        res.status(200).json(users);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_user = async (req,res) => {

    const { firstName,middleName,lastName,role,username,password,confirmPassword } = req.body;
    
    const isActive = true

    try {
        if(password === confirmPassword) {
            const newUser = await User.create({ firstName,middleName,role,lastName,username,password,isActive });
            const token = createToken(newUser._id);
            res.status(200).json({ mssg: `${firstName} has been added to the record`, token });
        } else {
            res.status(400).json({ mssg:'Password does not match, please check before submitting' });
        }
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ mssg: err.message });
    }
}

module.exports.delete_user = async (req,res) => {
    const { id } = req.params;

    try {
        const userFind = await User.findByIdAndUpdate({ _id: id },{ isActive: false });
        res.status(200).json({ mssg: `${userFind.firstName}'s user record has been deleted` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_user_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const userFind = await User.findById(id);
        res.status(200).json(userFind);
    } catch(err) {
        console.log(err);
    }
}

module.exports.edit_user = async (req,res) => {
    const { id } = req.params;

    const { newFirstName: firstName, newMiddleName: middleName, newLastName: lastName, newRole: role, newIsActive: isActive } = req.body;

    try {   
        const currUser = await User.findById(id);
        if(currUser.firstName !== firstName || currUser.middleName !== middleName || currUser.lastName !== lastName || currUser.role !== role || currUser.isActive !== isActive) {
            const newUser = await User.findByIdAndUpdate({ _id: id }, { firstName,middleName,lastName,role,isActive });
            res.status(200).json({ mssg: `${newUser.firstName} has been edited successfully!` });
        } else {
            res.status(400).json({ mssg: `Cannot update ${firstName}'s record, still the same with old value` })
        }
        
    } catch(err) {
        console.log(err);
    }
}

module.exports.user_login = async (req,res) => {

    const { username,password,session } = req.body;

    try {
        const login = await User.login(username,password,session);
        const token = createToken(login._id);
        const roleDetail = await Role.find({ _id: login.role });

        res.status(200).json({ mssg: `Login successful, welcome ${username}!`, token,data: login,role: roleDetail[0].userRole,redirect:'/' });
    } catch(err) {
        console.log(err.message);
        res.status(400).json({ mssg: err.message });
    }
}

// Payment Terms

module.exports.get_payment_terms = async (req,res) => {
    try {
        const paymentTerms = await PaymentTerm.find().populate('inputter');
        res.status(200).json(paymentTerms);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_payment_term = async (req,res) => {

    const { payEvery,installmentBy,inputter,term } = req.body;

    try {

        const newPaymentTerm = await PaymentTerm.create({ term,payEvery,installmentBy,inputter });
        console.log(newPaymentTerm);
        res.status(200).json({ mssg: `${term} has been added in payment terms record` });

    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_payment_term = async (req,res) => {
    const { id } = req.params;

    try {
        const paymentTermFind = await PaymentTerm.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${paymentTermFind.term} record has been deleted in the record` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.get_payment_term_details = async (req,res) => {
    const { id } = req.params;
    
    try {
        const paymentTermFind = await PaymentTerm.findById(id);
        res.status(200).json(paymentTermFind);
    } catch(err) {
        console.log(err);
    }
}   

module.exports.edit_payment_term = async (req,res) => {
    const { id } = req.params;

    const { newPayEvery,newInstallmentBy,currentUserId,newTerm } = req.body;

    try {
        const newPaymentTerm = await PaymentTerm.findByIdAndUpdate({ _id:id },{ payEvery: newPayEvery,installmentBy:newInstallmentBy,inputter:currentUserId,term:newTerm });
        res.status(200).json({ mssg: `${newPaymentTerm.term} has been updated successfully` });
    } catch(err) {
        console.log(err);
    }
}

// Fee Category

module.exports.get_fee_categories = async (req,res) => {

    try {
        const feeCategs = await FeeCategory.find().populate('inputter');
        res.status(200).json(feeCategs);
    } catch(err) {
        console.log(err)
    }

}

module.exports.get_fee_category_detail = async (req,res) => {

    const { id } = req.params;

    try {
        const feeCategs = await FeeCategory.find({ _id:id }).populate('inputter');
        res.status(200).json(feeCategs);
    } catch(err) {
        console.log(err)
    }

}

module.exports.add_fee_category = async (req,res) => {

    const { category,code,inputter } = req.body;

    try {
        const feeCateg = await FeeCategory.create({ category,code,inputter });
        res.status(200).json({ mssg:`${category} has been added to the record` });
    } catch(err) {
        console.log(err);
    }

}

module.exports.delete_fee_category = async (req,res) => {
    const { id } = req.params;

    try {
        const feeCategFind = await FeeCategory.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${feeCategFind.category} record has been deleted in the record` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.edit_fee_category = async (req,res) => {
    const { id } = req.params;

    const { category,code } = req.body;
    

    try {
        const newCategory = await FeeCategory.findByIdAndUpdate({ _id:id },{ category,code });
        res.status(200).json({ mssg: `${newCategory.category} has been updated successfully` });
    } catch(err) {
        console.log(err);
    }
}

// Fee Code

module.exports.get_fee_codes = async (req,res) => {

    try {
        const feeCodes = await FeeCode.find().populate('inputter feeCateg');
        res.status(200).json(feeCodes);
    } catch(err) {
        console.log(err)
    }
}

module.exports.add_fee_code = async (req,res) => {
    const { description,code,inputter,feeCategory } = req.body;
    console.log(feeCategory)

    try {
        const newFeeCode = await FeeCode.create({ description,code: code.toUpperCase(), inputter, feeCateg:feeCategory });
        res.status(200).json({ mssg: `${description} has been added to the record` });
    } catch(err) {
        console.log(err);
    }
    
}

module.exports.delete_fee_code = async (req,res) => {
    const { id } = req.params;

    try {
        const feeCode = await FeeCode.findByIdAndDelete(id);
        res.status(200).json({ mssg: `${feeCode.description} record has been deleted in the record` });
    } catch(err) {
        console.log(err)
    }
}

module.exports.edit_fee_code = async (req,res) => {
    const { id } = req.params;

    const { inputter,description,feeCateg,code} = req.body;

    try {
        const newCode = await FeeCode.findByIdAndUpdate({ _id:id },{ feeCateg,code: code.toUpperCase(),description,inputter });
        res.status(200).json({ mssg: `${newCode.description} has been updated successfully` });
    } catch(err) {
        console.log(err);
    }
}

// Parents

module.exports.get_parents = async (req,res) => {
    
    try {   
        const parents = await Parent.find().populate('studentId');
        res.status(200).json(parents);
    } catch(err) {
        console.log(err);
    }
}

module.exports.get_student_parent = async (req,res) => {
    const { id } = req.params;

    try {
        const parent = await Parent.find({ studentId: id }).populate('studentId');
        res.status(200).json(parent[0]);
    } catch(err) {
        console.log(err);
    }

}

module.exports.add_parent = async (req,res) => {
    const { motherName,
        fatherName,
        guardianName,
        motherOccupation,
        fatherOccupation,
        guardianOccupation,
        motherContact,
        fatherContact,
        guardianContact,
        motherEmail,
        fatherEmail,
        guardianEmail,
        motherOffice,
        fatherOffice,
        guardianOffice,
        studentId } = req.body;

        try {  
            const student = await Student.findById(studentId);
            const newParent = await Parent.create({ motherName,
                fatherName,
                guardianName,
                motherOccupation,
                fatherOccupation,
                guardianOccupation,
                motherContact,
                fatherContact,
                guardianContact,
                motherEmail,
                fatherEmail,
                guardianEmail,
                motherOffice,
                fatherOffice,
                guardianOffice,
                studentId 
            });

            res.status(200).json({ mssg:`Parent for ${student.firstName} ${student.lastName} has been added to the record`});
        } catch(err) {
            console.log(err);
        }
}

module.exports.get_parent_detail = async (req,res) => {
    const { id } = req.params;

    try {
        const parent = await Parent.findById(id).populate('studentId');
        res.status(200).json(parent);
    } catch(err) {
        console.log(err);
    }
}

module.exports.delete_parent = async (req,res) => {
    const { id } = req.params;

    try {
        const parent = await Parent.findByIdAndDelete(id).populate('studentId');
        res.status(200).json({ mssg: `Parent of ${parent.studentId.firstName} has been deleted in the record successfully` });
    } catch(err) {
        console.log(err);
    }
}

// For Academic

module.exports.get_academics = async (req,res) => {
    try {
        const academics = await Academic.find().populate('gradeLevelId studentId departmentId strandId sessionId');
        res.status(200).json(academics);
    } catch(err) {
        console.log(err);
    }
}

module.exports.add_academic = async (req,res) => {

    const { academicInfo } = req.body;
    const { strandId,departmentId,gradeLevelId,sessionId,studentId,lastSchoolAttended } = academicInfo

    // This will also update students info upon posting

    try {
        const academic = await Academic.create({ strandId,departmentId,gradeLevelId,sessionId,studentId,lastSchoolAttended });
        const student = await Student.findByIdAndUpdate({ _id: studentId }, { gradeLevel: gradeLevelId, sy_id: sessionId });
        res.status(200).json({ mssg: `${student.firstName} ${student.lastName}'s academic record has been created successfully` });
    } catch(err) {
        console.log(err);
    }

}
