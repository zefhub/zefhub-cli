/**
 * Copyright 2022 Synchronous Technologies Pte Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const zefops = `# Zefops generated with zefhub cli.
from zef import *
from zef.ops import *


@func(g)
def userCreate(z):
    print("UserCreate was run")
    # Assign the users some categories by default.
    data_g = Graph(z)

    for def_cat in data_g | now | all[ET.DefaultCategory]:
        new_cat = {ET.Category: {
            RT.Name: def_cat | F.Name | collect,
            RT.Icon: def_cat | F.Icon | collect,
            RT.User: z,
        }} | data_g | run
`;

export default zefops;
