import React, { useState } from "react";
import { connect } from "react-redux";
// import { onLogin, onSignup } from "../store/user.actions";
import { Formik } from "formik";
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { userService } from "../services/user.service";

export function LoginSignup(props) {
  const [isLogin, setIsLogin] = useState(true);
  const userTypes = ['רופא', 'מטופל', 'הורה'];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(4, "קצר מדי")
      .max(50, "ארוך מדי")
      .required("נדרש למלא שם מלא בשדה זה"),
    password: Yup.string()
      .min(8, "קצר מדי")
      .required("נדרש למלא סיסמא בשדה זה")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'סיסמא צריכה להכיל אותיות גדלות,אותיות קטנות,מספרים ותו מיוחד'
      ),
    userId: Yup.string()
      .min(8, "קצר מדי")
      .max(10, "ארוך מדי")
      .required("נדרש למלא תעודת זהות בשדה זה"),
    parentId: Yup.string()
      .min(8, "קצר מדי")
      .max(10, "ארוך מדי")
      .required("נדרש למלא תעודת זהות בשדה זה"),
    userType: Yup.string()
      .required("נדרש לבחור בשדה זה"),

  });

  const onSubmit = async (values, { resetForm }) => {
    const { fullName, password, userId, userType, parentId } = values;
    if (userId.trim() && password.trim()) {
      if (!isLogin) {
        userService.signup({ fullName, password, userId, userType, parentId })
        // props.onSignup({ userId, password, fullname, imgUrl: "" });
        // props.history.push("/workspace");
      } else {
        // props.onLogin({ userId, password });
        // props.history.push("/workspace");
      }
    }
  };
  return (
    <div className="login-signup  flex column align-center">
      <div className="login-container flex column">
        {isLogin ? <p>התחברות </p> : <p>הרשמה</p>}
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            userId: '',
            password: '',
            fullName: '',
            parentId: '',
            userType: ''
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {props => (
            <form className="flex column" onSubmit={props.handleSubmit}>
              <div className="flex column" >
                <label htmlFor="userId" className="auth-label" >
                  תעודת זהות
                </label>
                <TextField
                  variant="outlined"
                  placeholder="הכנס תעודת זהות"
                  id="userId"
                  name="userId"
                  onChange={props.handleChange}
                  value={props.values.userId}
                  inputProps={{ className: 'auth-input' }}
                  error={props.touched.userId && Boolean(props.errors.userId)}
                  helperText={(props.touched.userId && props.errors.userId) || " "}
                  FormHelperTextProps={{ style: { textAlign: 'right' } }}
                />
              </div>

              {!isLogin && <>

                <div className="flex column" >
                  <label htmlFor="parentId" className="auth-label" >
                    תעודת זהות הורה
                  </label>
                  <TextField
                    variant="outlined"
                    placeholder="הכנס תעודת זהות של הורה"
                    id="parentId"
                    name="parentId"
                    onChange={props.handleChange}
                    value={props.values.parentId}
                    inputProps={{ className: 'auth-input' }}
                    error={props.touched.parentId && Boolean(props.errors.parentId)}
                    helperText={(props.touched.parentId && props.errors.parentId) || " "}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                  />
                </div>


                <div className="flex column" >
                  <label htmlFor="fullName" className="auth-label" >
                    שם מלא
                  </label>
                  <TextField
                    variant="outlined"
                    placeholder="הכנס שם פרטי ומשפחה"
                    id="fullName"
                    name="fullName"
                    onChange={props.handleChange}
                    value={props.values.fullName}
                    inputProps={{ className: 'auth-input' }}
                    error={props.touched.fullName && Boolean(props.errors.fullName)}
                    helperText={(props.touched.fullName && props.errors.fullName) || " "}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                  />
                </div>

                <div className="flex column" >
                  <label htmlFor="userType" className="auth-label" >
                    בחירת סוג משתמש
                  </label>
                  <TextField
                    variant="outlined"
                    select
                    id="userType"
                    name="userType"
                    onChange={props.handleChange}
                    value={props.values.userType}
                    inputProps={{ className: 'auth-input' }}
                    error={props.touched.userType && Boolean(props.errors.userType)}
                    helperText={(props.touched.userType && props.errors.userType) || " "}
                    FormHelperTextProps={{ style: { textAlign: 'right' } }}
                  >
                    {userTypes.map(userType => (
                      <MenuItem key={userType} value={userType}>
                        {userType}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </>
              }

              <div className="flex column" >
                <label htmlFor="password" className="auth-label" >
                  סיסמא
                </label>
                <TextField
                  variant="outlined"
                  placeholder="הכנס סיסמא"
                  id="password"
                  name="password"
                  onChange={props.handleChange}
                  value={props.values.password}
                  inputProps={{ className: 'auth-input' }}
                  error={props.touched.password && Boolean(props.errors.password)}
                  helperText={(props.touched.password && props.errors.password) || " "}
                  FormHelperTextProps={{ style: { textAlign: 'right' } }}
                />
              </div>
              <button className="login-submit">
                {isLogin ? "התחבר" : "הרשם"}
              </button>
            </form>
          )}
        </Formik>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "הרשמה..." : "התחברות"}
        </p>
      </div>
    </div>
  );
}
// const mapDispatchToProps = {
//   onLogin,
//   onSignup,
// };
// export const LoginSignup = connect(null, null)(_LoginSignup);
// export const LoginSignup = connect(null, mapDispatchToProps)(_LoginSignup);
