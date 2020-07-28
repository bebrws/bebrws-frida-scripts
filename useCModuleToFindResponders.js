var source = [
'',

'#include <stdio.h>',
'#include <stdlib.h>',
'#include <Foundation/Foundation.h>',
'',
'NSArray *getResponderSubclasses()',
'{',
'    int numClasses = objc_getClassList(NULL, 0);',
'    Class *classes = NULL;',
'',
'    classes = malloc(sizeof(Class) * numClasses);',
'    numClasses = objc_getClassList(classes, numClasses);',
'    ',
'    NSMutableArray *result = [NSMutableArray array];',
'    for (NSInteger i = 0; i < numClasses; i++)',
'    {',
'        Class curClass = classes[i];',
'        NSMutableArray *curList = [NSMutableArray array];',
'        BOOL isNSObjOrResponder = NO;',
'        BOOL wasResponderChain = NO;',
'',
'        for(Class candidate = curClass; candidate != Nil && !isNSObjOrResponder; candidate = class_getSuperclass(candidate))',
'        {',
'            if(candidate == objc_getClass("NSObject") || candidate == objc_getClass("NSResponder")) {',
'                isNSObjOrResponder = YES;',
'                wasResponderChain = (candidate == objc_getClass("NSResponder"));',
'            } else {',
'                [curList addObject:candidate];',
'            }',
'        }',
'',
'        if (wasResponderChain) {',
'            [result addObjectsFromArray:curList];',
'        }',
'    }',
'',
'    free(classes);',
'    ',
'    return result;',
'}'
].join('\n');

var cm = new CModule(source);

console.log(JSON.stringify(cm));

var getResponderSubclasses = new NativeFunction(cm.getResponderSubclasses, 'NSArray *', []);
// getResponderSubclasses();