#!/bin/bash
READ_FILE() {
    echo -e "\n~~~ Buiness Employment Data ~~~\n"
    echo $1
    # if file/argument is not found
    if [[ -z $1 ]]
    then
    # arguments not loaded
    echo "\nno arguments loaded"
    else
    # file is found
    # get file type
    FILE="$1"
    FILETYPE=$(echo "$FILE" | sed 's/^.*\.//')
    echo -e "\n$FILETYPE\n"
    # if filetype does not equal csv
    if [[ ! $FILETYPE =~ 'csv' ]]
    then
    # invalid type
    echo "\nCheck the file type and try again."
    else
    # valid type
    # pipe through the file
    cat $FILE |while IFS="," read Series_reference Period Data_value Suppressed STATUS UNITS Magnitude Subject Group Series_title_1 Series_title_2 Series_title_3 Series_title_4 Series_title_5;
    do echo "$Series_reference $Period $Data_value $Suppressed $STATUS $UNITS $Magnitude $Subject $Group $Series_title_1 $Series_title_2 $Series_title_3 $Series_title_4 $Series_title_5"
    done
    fi
    fi

    
}

READ_FILE $1
# Series_reference BAR Period,Data_value,Suppressed,STATUS,UNITS,Magnitude,Subject,Group,Series_title_1,Series_title_2,Series_title_3,Series_title_4,Series_title_5