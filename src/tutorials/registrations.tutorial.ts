import { IRegistration } from '../injection/IRegistration';
import { IInjector } from '../injection/IInjector';
import { Tutorial } from '../tutorials/tutorial';

export class TutorialRegistration implements IRegistration {
    public register(injector: IInjector): void {
        injector.bind("tutorial", Tutorial);
    }
}
