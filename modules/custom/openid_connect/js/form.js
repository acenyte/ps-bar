// function runOauthLogin(e, obj) {
//     e.preventDefault();
//     //obj.attr('data-truevalue','true');
//     obj.truevalue = 'true';
//     console.log('name: ', obj);
//     jQuery('#oaith_login_type').attr('value', obj.name);
//     jQuery('#oaith_login_type').val(obj.name);
//     console.log('form: ',jQuery('#openid-connect-login-form'));
//     jQuery('#openid-connect-login-form')[0].append('<input type="text" value="'+obj.name+'" name="oauth_login_value">');
//     jQuery('#openid-connect-login-form')[0].submit(function(){
        
//         return true;
//     });
// }