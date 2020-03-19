// Following are the possible conditional options :
// >None
// >Equal to A
// >Not Equal to A
// >Greater than A
// >Less than A
// >Greater than or equal to A
// >Less than or equal to A
// >Not less than A, not greater than B
// >Less than A or greater than B

// The function below returns a boolean depending upon whether the condition is satisfied
const checkConditional = (conditional_option, test_value, conditional_value_a, conditional_value_b ) => {
    test_value = parseInt(test_value);
    conditional_value_a = parseInt(conditional_value_a);
    conditional_value_b = parseInt(conditional_value_b);

    if (!test_value){
        return false
    }

    switch (conditional_option) {
        case '0':
            return false 
        case '1':
            return test_value === conditional_value_a
        case '2':
            return (test_value !== conditional_value_a)
        case '3':
            return (test_value > conditional_value_a)
        case '4':
            return (test_value < conditional_value_a)
        case '5':
            return (test_value >= conditional_value_a)
        case '6':
            return (test_value <= conditional_value_a)
        case '7':
            return (!(test_value < conditional_value_a) && !(test_value > conditional_value_b))
        case '8':
            return ((test_value < conditional_value_a) || (test_value > conditional_value_b))
        default:
            return false
    }
}

module.exports.checkConditional = checkConditional;

const getConfigurationRowColor = (color_option, index) => { 
    if (index % 2 === 0){
        return 'white'
    }
    else{
        switch (color_option) {
            // blue color
            case '1' : {
                return 'rgb(232, 240, 254)'
            }   
            
            // green
            case '2' : {
                return 'rgb(231, 249, 239)'
            }
    
            // red
            case '3' : {
                return 'rgb(253, 220, 232)'
            }
    
            // brown
            case '4' : {
                return 'rgb(248, 242, 235)'
            }

            // grey
            case '5' : {
                return 'rgb(243, 243, 243)'
            }

            // default white
            default : {
                return 'white'
            }
        }
    }
}

module.exports.getConfigurationRowColor = getConfigurationRowColor;

const getConfigurationHeaderColor = (color_option) => { 
    switch (color_option) {
        // blue color
        case '1' : {
            return 'rgb(91, 149, 249)'
        }   
        
        // green
        case '2' : {
            return 'rgb(99, 210, 151)'
        }

        // red
        case '3' : {
            return 'rgb(233, 29, 99)'
        }

        // brown
        case '4' : {
            return 'rgb(204, 166, 119)'
        }

        // grey
        case '5' : {
            return 'rgb(189, 189, 189)'
        }

        // default white
        default : {
            return 'rgb(91, 149, 249)'
        }
    }
}

module.exports.getConfigurationHeaderColor = getConfigurationHeaderColor;

const getDelimitedValue = (value) => {
    return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const getConfigurationValue = (configurations_widget, value) => {
    // number_format : ["general", "currency", "percent", "delimiter"];
    const parsed_number = parseFloat(value);
    const { number_format, number_decimal } = configurations_widget;

    if (parsed_number) {
        const parsed_number_decimal = parseInt(number_decimal);
        const test_value = parsed_number.toFixed(parsed_number_decimal);
        switch (number_format) {
            case '1' : {
                return `$ ${test_value}`
            }
    
            case '2' : {
                return `${test_value*100}%`
            }
    
            case '3' : {
                return getDelimitedValue(test_value.toString())
            }
    
            default : {
                return test_value
            }
        }
    }
    else{
        return value
    }
}

module.exports.getConfigurationValue = getConfigurationValue;